import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <div className="App h-screen w-screen bg-black text-white">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
