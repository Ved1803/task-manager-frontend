import { useEffect, useState } from "react";
import API from "../services/api";
import TaskForm from "./TaskForm";
import "./TaskList.css"; 

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // useEffect(() => {
  //   API.get("/tasks").then((res) => setTasks(res.data));
  // }, []);

  useEffect(() => {
    API.get("/tasks")
      .then((res) => {
        console.log("Tasks Response:", res); // Logs the response data
        setTasks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error); // Logs any errors
      });
  }, []);
  

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const openStatusModel = (task) => {
    setSelectedTask(task);
    setStatusModalOpen(true);
  }

  const updateStatus = (updatedStatus) => {
    console.log(updatedStatus, 'UPDATED STATUS')

    if (!selectedTask) return;

    API.put(`/tasks/${selectedTask.id}`, { status: updatedStatus })
      .then(() => {
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? { ...task, status: updatedStatus } : task
        ));
        setStatusModalOpen(false);
        setSelectedTask(null);
      })
      .catch(err => console.error("Failed to update status:", err));
  };

  return (
    <div>
      <h2>All Tasks</h2>
      <button className="create-task-btn" onClick={() => setIsModalOpen(true)}>
        + Create Task
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <TaskForm onTaskCreated={addTask} />
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Key</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td>{index + 1}</td>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <span onClick={() => openStatusModel(task)} style={{ cursor: "pointer", color: "black", textDecoration: "underline" }}>
                  {task.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {statusModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setStatusModalOpen(false)}>
              &times;
            </span>
            <h3>Update Status for: {selectedTask?.title}</h3>
            <div>
              <label>
                <input
                  type="radio"
                  value="pending"
                  checked={selectedTask.status === "pending"}
                  onChange={(e) => updateStatus(e.target.value)}
                />
                Pending
              </label>
              <label>
                <input
                  type="radio"
                  value="in_progress"
                  checked={selectedTask.status === "in_progress"}
                  onChange={(e) => updateStatus(e.target.value)}
                />
                In Progress
              </label>
              <label>
                <input
                  type="radio"
                  value="done"
                  checked={selectedTask.status === "done"}
                  onChange={(e) => updateStatus(e.target.value)}
                />
                Done
              </label>
              <label>
                <input
                  type="radio"
                  value="todo"
                  checked={selectedTask.status === "todo"}
                  onChange={(e) => updateStatus(e.target.value)}
                />
                To-do
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskList;
