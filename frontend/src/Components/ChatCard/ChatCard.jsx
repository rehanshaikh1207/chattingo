import React from "react";

const ChatCard = ({ userImg, name, lastMessage, isChat }) => {
  // Function to format a timestamp to a readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return "yesterday";
    
    const options = { month: "short", day: "numeric" };
    return messageDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center p-4 hover:bg-white/5 transition-all group cursor-pointer">
      <div className="relative flex-shrink-0">
        <img 
          className="h-14 w-14 rounded-full border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform" 
          src={userImg} 
          alt="profile" 
        />
        {isChat && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-300 transition-colors">
            {name}
          </h3>
          <span className="text-white/50 text-sm flex-shrink-0 ml-2">
            {lastMessage ? formatTimestamp(lastMessage.timestamp) : ""}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-white/70 text-sm truncate flex-1 mr-2">
            {lastMessage ? lastMessage.content : "No messages yet"}
          </p>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {lastMessage && (
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
