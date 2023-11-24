import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const username = sessionStorage.getItem('username');
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const socket = io('http://localhost:8000', {
    // ackTimeout: 10000,
    // retries: 3,
    auth: {
      serverOffset: 0
    }
  });

  socket.on('connect', () => {
    // console.log(socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  useEffect(() => {
    const handleReceivedMessage = (msg) => {
      setMessageList((prevMessages) => [...prevMessages, msg]);
      console.log(messageList);
      // window.scrollTo(0, document.body.scrollHeight);
      socket.auth.serverOffset = message._id;
    };
    
    if(username) {
      socket.on('chat message', handleReceivedMessage);
    }
      
    return () => {
      socket.off('chat message', handleReceivedMessage);
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleInput = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      console.log("Empty Message");
      return;
    }

    console.log(message);
    const clientOffset = `${socket.id}-${uuidv4()}`;
    console.log(clientOffset);
    // socket.emit('chat message', message, clientOffset);
    socket.emit('chat message', message, username);
    setMessage("");
  };

  return (
    <div className='flex'>
      <div className='md:w-1/4'>
        <input id='search' className='md:m-5 md:p-3 m-2 bg-black border rounded-xl' placeholder='search..' />
        <div className='border-t'>

        </div>
      </div>
      <div className='md:w-3/4'>
        <ul id="messages" className='h-screen overflow-y-auto'>
          {messageList.map((item, index) => (
            <li key={uuidv4()} className='flex'>
              {item.username && <div className='italic mr-2'>{item.username}:</div>}
              <div>{item.content}</div>
            </li>
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
    </div>  
  );
};

export default Chat;
