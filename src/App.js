import React, { useState, useEffect, useRef } from "react";
import { LexRuntimeV2 } from "aws-sdk";
import "./App.css";
import ChatSendMessage from "./components/ChatSendMessage";
import ChatReplyMessage from "./components/ChatReplyMessage";
import { SlReload } from "react-icons/sl";
import { IoMdSend } from "react-icons/io";
import Spinner from "./components/Spinner/Spinner";
import { v4 as uuidv4 } from "uuid";

const config = {
  region: process.env.REACT_APP_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECERET_ACCESS_KEY,
  },
};

const lexRuntimeClient = new LexRuntimeV2(config);

function App() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(uuidv4());
  const chatContainerRef = useRef(null);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleUserMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim() === "") return;
    setLoading(true);
    const params = {
      botId: process.env.REACT_APP_BOT_ID,
      botAliasId: process.env.REACT_APP_BOT_ALIAS_ID,
      localeId: process.env.REACT_APP_LOCALE_ID,
      sessionId: sessionId,
      text: userInput,
    };
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: userInput, sender: "user" },
      ]);
      const response = await lexRuntimeClient.recognizeText(params).promise();
      const botMessages = response.messages.map((message) => ({
        content: message.content,
        sender: "bot",
      }));
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
      setUserInput("");
    } catch (error) {
      console.error(error);
      setUserInput("");
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleReload = () => {
    setUserInput("");
    setMessages([]);
    setLoading(false);
    setSessionId(uuidv4());
  };

  useEffect(() => {
    handleReload();
  }, []);

  return (
    <div className="container">
      <div className="chatbotMainContainer">
        <div className="chatbot">
          <div className="header">
            <div className="Logo">
              <img
                src={require("./assets/chatbot.png")}
                className="logoimage"
                alt="chatboticon"
              />
              <p>RideRequest</p>
            </div>
            <SlReload onClick={handleReload} className="relaodIcon" />
          </div>
          <div className="chat" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {message.sender === "user" ? (
                  <ChatSendMessage message={message.content} />
                ) : (
                  <ChatReplyMessage message={message.content} />
                )}
              </React.Fragment>
            ))}
            {loading && <Spinner />}
          </div>
          <form onSubmit={handleUserMessage} className="messageTypeContainer">
            <input
              type="text"
              value={userInput}
              placeholder="Type Message"
              onChange={handleUserInput}
            />
            <button className="btn btn-primary" type="submit">
              <IoMdSend className="sendIcon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
