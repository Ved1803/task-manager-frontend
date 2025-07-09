import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import TaskList from "./components/task/TaskList";
import Home from "./pages/Home";
import "./App.css";
import { useSelector } from "react-redux";
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateUser from "./pages/users/UpdateUser";
import Projects from "./pages/Projects/Projects";
import CreateProjectForm from "./pages/Projects/CreateProjectForm";
import ShowProject from "./pages/Projects/ShowProject";
import TaskForm from "./components/task/TaskForm";
import Tasks from "./pages/TaskDetails/Tasks";

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
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<CreateProjectForm />} />
          <Route path="/projects/:id" element={<ShowProject />} />
          <Route path="/projects/:id/tasks" element={<Tasks />} />
          <Route path="/projects/:id/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/users/:id" element={<UpdateUser />} />
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
          style={{ fontSize: "14px" }}
        />
      </div>
    </>
  );
}

export default App;
