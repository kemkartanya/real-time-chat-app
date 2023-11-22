import React, { useEffect, useState } from 'react';
import axios from 'axios'

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const username = sessionStorage.getItem('username');
  let counter = 0;
  const socket = io({
    ackTimeout: 10000,
    retries: 3,
    auth: {
      serverOffset: 0
    }
  });

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };  

  const handleInput = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      console.log("Empty Message");
      return;
    }
    
    // pushing message to database
    try {
      const response = await axios.post(
        'http://localhost:8000/mess/', {
          username: username,
          message: message,
        },
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      );
    
      const data = await response.data;

      if (data) {
        console.log(data);
      } else {
        alert('Please check your username and password')
      }
    
    } catch (error) {
      console.error('Login failed', error);
    }

    if (input.value) {
      const clientOffset = `${socket.id}-${counter++}`;
      socket.emit('chat message', input.value, clientOffset);
      input.value = '';
    }

    socket.on('chat message', (msg, serverOffset) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
      socket.auth.serverOffset = serverOffset;
    });

    setMessage("");
    console.log(message);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/mess/', {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        const data = response.data;

        if (data) {
          setMessageList(data.data);
          console.log(data);
        } else {
          alert('Error fetching data. Please check your request.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 

  }, [message]);

  


  return (
    <div>
      <ul id="messages">
        {messageList.map((item, index) => (
          <li key={index} className='flex'>
            <div className='italic mr-2'>{item.username}:</div>
            <div>{item.message}</div>
            {/* <div className='italic ml-5'>{item.createdAt}</div> */}
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
  );
};

export default Chat;
