import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import TaskList from "./components/TaskList";
import Home from "./pages/Home";
import "./App.css";
import TaskForm from "./components/TaskForm";
import { useSelector } from "react-redux";
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import { Bounce, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
<div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/tasks"
            element={token ? <TaskList /> : <Navigate to="/login" />}
          />
          <Route path="/create_task" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </>
  );
}

export default App;
