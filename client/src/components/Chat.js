import React, { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };  

  const handleInput = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      console.log("Empty Message");
      return;
    }
    
    setMessageList([...messageList, message]);
    setMessage("");

    console.log(message);
  };

  return (
    <div>
      <ul id="messages">
        {messageList.map((mess, index) => (
          <li key={index}>{mess}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleInput}>
        <input
          name="message"
          type="text"
          placeholder="Write your message"
          id="input"
          value={message}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
