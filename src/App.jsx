import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import TaskList from "./components/TaskList";
import Home from "./pages/Home";
import "./App.css"; 
import TaskForm from "./components/TaskForm";
import { useSelector } from "react-redux";




function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/tasks"
          element={token ? <TaskList /> : <Navigate to="/login" />}
        />
        <Route path="/create_task" element={<TaskForm/>} />
        <Route path="/testing" element={<Testing/>} />
      </Routes>
    </>

  );
}

export default App;
