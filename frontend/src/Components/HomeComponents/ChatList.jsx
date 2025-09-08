import React from 'react';
import ChatCard from '../ChatCard/ChatCard';

const ChatList = ({
  querys,
  auth,
  chat,
  lastMessages,
  handleClickOnChatCard,
  handleCurrentChat,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {querys && Array.isArray(auth.searchUser) &&
        auth.searchUser.map((item, index) => (
          <div 
            key={index} 
            onClick={() => handleClickOnChatCard(item.id)}
            className="hover:bg-white/10 transition-all cursor-pointer border-b border-white/5"
          >
            <ChatCard
              name={item.name}
              userImg={
                item.profile ||
                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
              }
              lastMessage={{
                content:
                  lastMessages[item.id]?.content || "Start your conversation",
                timestamp: lastMessages[item.id]?.timestamp || "",
              }}
            />
          </div>
        ))}
      
      {chat?.chats?.length > 0 &&
        !querys &&
        chat?.chats?.map((item, index) => (
          <div 
            key={index} 
            onClick={() => {
              handleCurrentChat(item);
              console.log("the item is ", item);
            }}
            className="hover:bg-white/10 transition-all cursor-pointer border-b border-white/5 animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ChatCard
              isChat={!item.group}
              name={
                item.group 
                  ? item.chatName 
                  : auth.reqUser?.id !== item.users[0]?.id 
                    ? item.users[0]?.name 
                    : item.users[1]?.name
              }
              userImg={
                item.chatImage ||
                (item.group 
                  ? "https://media.istockphoto.com/id/1455296779/photo/smiling-businesspeople-standing-arm-in-arm-in-an-office-hall.webp?b=1&s=170667a&w=0&k=20&c=0bdu3-mVcOw6FN_vIkwTx4pCE6jgL7Jy29bBWZhoiik="
                  : (auth.reqUser?.id !== item.users[0]?.id 
                      ? item.users[0]?.profile 
                      : item.users[1]?.profile) ||
                    "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0=")
              }
              lastMessage={{
                content:
                  lastMessages[item.id]?.content || "Start your conversation",
                timestamp: lastMessages[item.id]?.timestamp || "",
              }}
            />
          </div>
        ))}
      
      {(!chat?.chats || chat.chats.length === 0) && !querys && (
        <div className="flex flex-col items-center justify-center h-64 text-white/60">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
          </svg>
          <p className="text-center">No conversations yet</p>
          <p className="text-sm text-center mt-2">Search for users to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
