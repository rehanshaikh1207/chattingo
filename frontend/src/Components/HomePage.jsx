import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";
import SockJs from "sockjs-client/dist/sockjs";
import { GiCat } from "react-icons/gi";
import { Client } from "@stomp/stompjs";
import { BASE_API_URL } from "../config/api";
import ProfileSection from "./HomeComponents/ProfileSection";
import SearchBar from "./HomeComponents/SearchBar";
import ChatList from "./HomeComponents/ChatList";
import MessageCard from "./MessageCard/MessageCard";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsMicFill, BsThreeDotsVertical } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

function HomePage() {
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [isGroup, setIsGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to establish a WebSocket connection
  const connect = () => {
    if (!token) {
      console.log("No token available, skipping WebSocket connection");
      return; // don't attempt without auth
    }
    
    console.log("Attempting to connect to WebSocket...");
    
    const client = new Client({
      webSocketFactory: () => new SockJs(`${BASE_API_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
      onConnect: onConnect,
      onStompError: onError,
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
    });
    
    setStompClient(client);
    client.activate();
  };

  // Function to get a specific cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  // Callback for WebSocket connection error
  const onError = (error) => {
    console.error("STOMP connection error:", error);
    setIsConnected(false);
  };

  // Callback for successful WebSocket connection
  const onConnect = () => {
    console.log("WebSocket connected successfully");
    setIsConnected(true);

    // Subscribe to the current chat messages based on the chat type
    if (stompClient && currentChat) {
      if (currentChat.group) {
        // Subscribe to group chat messages
        stompClient.subscribe(`/group/${currentChat?.id}`, onMessageReceive);
      } else {
        // Subscribe to direct user messages
        stompClient.subscribe(`/user/${currentChat?.id}`, onMessageReceive);
      }
    }
  };

  // Callback to handle received messages from WebSocket
  const onMessageReceive = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  // Helper function to safely send messages via WebSocket
  const sendMessageViaWebSocket = (messageData) => {
    if (!stompClient) {
      console.warn("STOMP client not available");
      return false;
    }
    
    if (!stompClient.connected) {
      console.warn("STOMP client not connected");
      return false;
    }
    
    if (typeof stompClient.send !== 'function') {
      console.warn("STOMP client send method not available");
      return false;
    }
    
    try {
      stompClient.send("/app/message", {}, JSON.stringify(messageData));
      console.log("Message sent via WebSocket:", messageData);
      return true;
    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
      return false;
    }
  };

  // Effect to establish a WebSocket connection
  useEffect(() => {
    connect();
    return () => {
      try {
        if (stompClient) {
          console.log("Cleaning up WebSocket connection...");
          stompClient.deactivate();
          setIsConnected(false);
        }
      } catch (e) {
        console.error("Error during WebSocket cleanup:", e);
      }
    };
  }, []);

  // Effect to subscribe to a chat when connected
  useEffect(() => {
    if (isConnected && stompClient && currentChat?.id) {
      const subscription = currentChat.group
        ? stompClient.subscribe(`/group/${currentChat.id}`, onMessageReceive)
        : stompClient.subscribe(`/user/${currentChat.id}`, onMessageReceive);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConnected, stompClient, currentChat]);

  // Effect to handle sending a new message via WebSocket
  useEffect(() => {
    if (message.newMessage && isConnected && currentChat?.id) {
      const messageSent = sendMessageViaWebSocket(message.newMessage);
      
      if (messageSent) {
        // Message sent successfully via WebSocket
        setMessages((prevMessages) => [...prevMessages, message.newMessage]);
      } else {
        // Fallback: just add the message to local state
        console.log("Adding message to local state as fallback");
        setMessages((prevMessages) => [...prevMessages, message.newMessage]);
      }
    }
  }, [message.newMessage, isConnected, currentChat]);

  // Effect to set the messages state from the store
  useEffect(() => {
    if (message.messages) {
      setMessages(message.messages);
    }
  }, [message.messages]);

  // Effect to get all messages when the current chat changes
  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getAllMessages({ chatId: currentChat.id, token }));
    }
  }, [currentChat, message.newMessage]);

  // Effect to get user chats and groups
  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [chat.createdChat, chat.createdGroup]);

  // Function to handle opening the user menu
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // Function to handle closing the user menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle clicking on a chat card
  const handleClickOnChatCard = (userId) => {
    dispatch(createChat({ token, data: { userId } }));
  };

  // Function to handle user search
  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  // Function to create a new message
  const handleCreateNewMessage = () => {
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content },
      })
    );
    setContent(""); // Clear content after sending
  };

  // Effect to get the current user's information
  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);

  // Function to set the current chat
  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  };

  // Effect to fetch messages when chat changes
  useEffect(() => {
    chat?.chats && Array.isArray(chat.chats) &&
      chat.chats.forEach((item) => {
        dispatch(getAllMessages({ chatId: item.id, token }));
      });
  }, [chat?.chats, token, dispatch]);

  // Effect to update lastMessages when messages change
  useEffect(() => {
    const prevLastMessages = { ...lastMessages };
    if (message.messages && message.messages.length > 0) {
      message.messages.forEach((msg) => {
        prevLastMessages[msg.chat.id] = msg;
      });

      setLastMessages(prevLastMessages);
    }
  }, [message.messages]);

  // Function to navigate to the user's profile
  const handleNavigate = () => {
    setIsProfile(true);
  };

  // Function to close the user's profile
  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  // Function to handle creating a new group
  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    try {
      if (stompClient) {
        console.log("Disconnecting WebSocket during logout...");
        stompClient.deactivate();
        setIsConnected(false);
      }
    } catch (e) {
      console.error("Error during logout WebSocket cleanup:", e);
    }
    dispatch(logoutAction());
    navigate("/signin");
  };

  // Effect to check if the user is authenticated
  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signin");
    }
  }, [auth.reqUser]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-fadeIn">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10 p-4 h-screen flex items-center justify-center">
        <div className="flex glass h-[95vh] w-full max-w-7xl shadow-2xl overflow-hidden">
          <div className="left w-[30%] h-full glass-dark border-r border-white/10">
            {isProfile && (
              <div className="w-full h-full animate-slideIn">
                <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
              </div>
            )}
            {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
            {!isProfile && !isGroup && (
              <div className="w-full h-full flex flex-col">
                <ProfileSection
                  auth={auth}
                  isProfile={isProfile}
                  isGroup={isGroup}
                  handleNavigate={handleNavigate}
                  handleClick={handleClick}
                  handleCreateGroup={handleCreateGroup}
                  handleLogout={handleLogout}
                  handleClose={handleClose}
                  open={open}
                  anchorEl={anchorEl}
                />
                <SearchBar
                  querys={querys}
                  setQuerys={setQuerys}
                  handleSearch={handleSearch}
                />
                <ChatList
                  querys={querys}
                  auth={auth}
                  chat={chat}
                  lastMessages={lastMessages}
                  handleClickOnChatCard={handleClickOnChatCard}
                  handleCurrentChat={handleCurrentChat}
                />
              </div>
            )}
          </div>
          
          {/* Default Chattingo Page */}
          {!currentChat?.id && (
            <div className="w-[70%] flex flex-col items-center justify-center h-full bg-gradient-to-br from-white/5 to-white/10">
              <div className="max-w-[70%] text-center animate-fadeIn">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse-custom"></div>
                  <img
                    className="relative z-10 w-32 h-32 mx-auto rounded-full shadow-2xl"
                    src="https://cdn.pixabay.com/photo/2015/08/03/13/58/whatsapp-873316_640.png"
                    alt="chattingo-icon"
                  />
                </div>
                <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Chattingo Web
                </h1>
                <p className="text-white/80 text-lg leading-relaxed">
                  Connect instantly with friends and family.<br />
                  <span className="text-blue-300">Start a conversation to begin messaging.</span>
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Message Section */}
          {currentChat?.id && (
            <div className="w-[70%] relative bg-gradient-to-br from-white/5 to-white/10 flex flex-col">
              {/* Header */}
              <div className="glass-dark border-b border-white/10 p-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                        src={
                          currentChat.group
                            ? currentChat.chat_image ||
                            "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                            : auth.reqUser?.id !== currentChat.users[0]?.id
                              ? currentChat.users[0]?.profile ||
                              "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                              : currentChat.users[1]?.profile ||
                              "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                        }
                        alt="profile"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {currentChat.group
                          ? currentChat.chatName
                          : auth.reqUser?.id !== currentChat.users[0]?.id
                            ? currentChat.users[0].name
                            : currentChat.users[1].name}
                      </p>
                      <p className="text-white/60 text-sm">Online</p>
                    </div>
                  </div>
                  <div className="flex space-x-4 items-center text-white/70">
                    <AiOutlineSearch className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    <BsThreeDotsVertical className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={messageContainerRef}>
                <div className="flex flex-col space-y-3">
                  {messages?.length > 0 &&
                    messages?.map((item, i) => (
                      <div key={i} className="message-enter-active">
                        <MessageCard
                        key={i}
                        isReqUserMessage={item?.user?.id !== auth?.reqUser?.id}
                        content={item.content}
                        timestamp={item.timestamp}
                        profilePic={item?.user?.profile || "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="}
                      />
                      </div>
                    ))}
                </div>
              </div>

              {/* Message Input Section */}
              <div className="glass-dark border-t border-white/10 p-4 flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <BsEmojiSmile className="text-white/70 hover:text-yellow-400 cursor-pointer transition-colors text-xl" />
                  <ImAttachment className="text-white/70 hover:text-blue-400 cursor-pointer transition-colors text-xl" />
                  
                  <div className="flex-1 relative">
                    <input
                      className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-full outline-none text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/20 transition-all"
                      type="text"
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Type a message..."
                      value={content}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleCreateNewMessage();
                          setContent("");
                        }
                      }}
                    />
                  </div>
                  
                  {content.trim() ? (
                    <button
                      onClick={handleCreateNewMessage}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full transition-all hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    </button>
                  ) : (
                    <BsMicFill className="text-white/70 hover:text-red-400 cursor-pointer transition-colors text-xl" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
