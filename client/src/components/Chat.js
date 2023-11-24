import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

const Chat = () => {
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('token');
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
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
    getUsers();
    const handleReceivedMessage = (msg) => {
      setMessageList((prevMessages) => [...prevMessages, msg]);
      console.log(messageList);
      // window.scrollTo(0, document.body.scrollHeight);
      socket.auth.serverOffset = message._id;
    };
    
    if(username) {
      socket.on('chat message', handleReceivedMessage);
    }

    socket.on('private message', (data) => {
      const { from, message } = data;
    
      console.log(`Received private message from ${from}: ${message}`);
    });
    
    socket.emit('private message', {
      to: 'socket-id-of-recipient',
      message: 'This is a private message.',
    });
      
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

  const getUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/users/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
      });

      const data = await response.data

      if (data) {
        console.log(data.data);
        setUserList(data.data);
      } else {
        alert('Please check your username and password')
      }
    
    } catch (error) {
      console.error('could not get users', error);
    }
  }

  return (
    <div className='flex'>
      <div className='md:w-1/5'>
        <input id='search' className='md:m-5 md:p-3 m-2 bg-black border rounded-xl' placeholder='search..' />
        <div className='border-t'>
        {userList.map((user, index) => (
          <div key={index} className='bg-[#800080] m-2 rounded-2xl p-3 px-10'>
            <div>{user.username}</div> 
          </div>
        ))}
        </div>
      </div>
      <div className='md:w-4/5'>
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
