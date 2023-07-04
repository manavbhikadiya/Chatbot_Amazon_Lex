import React from "react";

const ChatSendMessage = (props) => {
  return (
    <div className="sent">
      <p>{props.message}</p>
    </div>
  );
};

export default ChatSendMessage;
