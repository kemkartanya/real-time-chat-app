import './App.css';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Login from './components/Login';
import Chat from './components/Chat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Route>
  )
);

function App() {
  return (
    <div className="App h-screen w-screen bg-black text-white">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
