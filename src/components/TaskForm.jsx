import { useEffect, useState } from "react";
import API from "../services/api";
import "./TaskForm.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const TaskForm = ({ onTaskCreated }) => {

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[token])

  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/tasks", task);
      onTaskCreated(response.data.task);
      toast.success("Task created successfully");
      setTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Faild Task creation")
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Task Title"
        required
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Task Description"
        required
      />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
