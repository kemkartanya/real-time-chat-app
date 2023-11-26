import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = io('http://localhost:8000', { autoConnect: false });

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  })

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
  }

  return (
    <div className='flex'>
      <div className='md:w-1/5'>
        {/* <input id='search' className='md:m-5 md:p-3 m-2 bg-black border rounded-xl' placeholder='search..' /> */}
        {/* <div className='border-t'>
        {users.map((user) => (
          <div key={user._id} className='bg-[#800080] m-2 rounded-2xl p-3 px-10'>
            <div>{user.username}</div> 
          </div>
        ))}
        </div> */}
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.userID} onClick={() => setSelectedUser(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className='md:w-4/5'>
        <ul id="messages" className='h-screen overflow-y-auto'>
          {/* {messageList.map((item, index) => (
            <li key={index} className='flex'>
              {item.username && <div className='italic mr-2'>{item.username}:</div>}
              <div>{item.content}</div>
            </li>
          ))} */}
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
