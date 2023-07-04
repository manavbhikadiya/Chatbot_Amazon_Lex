import React from "react";

const ChatReplyMessage = (props) => {
  return (
    <div className="reply">
      <p>{props.message}</p>
    </div>
  );
};

export default ChatReplyMessage;
