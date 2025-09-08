import React from 'react';

const MessageCard = ({ isReqUserMessage, content, timestamp, profilePic }) => {
  return (
    <div className={`flex w-full ${isReqUserMessage ? 'justify-start' : 'justify-end'} my-2 animate-fadeIn`}>
      {isReqUserMessage && profilePic && (
        <img 
          src={profilePic} 
          alt="profile" 
          className="w-8 h-8 rounded-full mr-3 border-2 border-white/20 shadow-lg flex-shrink-0" 
        />
      )}
      
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg relative group`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:scale-105 ${
            isReqUserMessage 
              ? 'bg-white/20 text-white border border-white/30' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{content}</p>
          {timestamp && (
            <div className="flex justify-end mt-2">
              <span className={`text-xs opacity-70 ${
                isReqUserMessage ? 'text-white/70' : 'text-white/80'
              }`}>
                {new Date(timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>
        
        {/* Message tail */}
        <div className={`absolute top-4 w-0 h-0 ${
          isReqUserMessage 
            ? '-left-2 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white/20'
            : '-right-2 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-blue-500'
        }`}></div>
      </div>
      
      {!isReqUserMessage && profilePic && (
        <img 
          src={profilePic} 
          alt="profile" 
          className="w-8 h-8 rounded-full ml-3 border-2 border-white/20 shadow-lg flex-shrink-0" 
        />
      )}
    </div>
  );
};

export default MessageCard;
