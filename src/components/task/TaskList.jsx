import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./TaskList.css";
import { toast } from "react-toastify";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    API.get("/tasks")
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      });
  }, []);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const openStatusModel = (task) => {
    setSelectedTask(task);
    setStatusModalOpen(true);
  };

  const updateStatus = (updatedStatus) => {
    console.log(updatedStatus, "UPDATED STATUS");

    if (!selectedTask) return;

    API.put(`/tasks/${selectedTask.id}`, { status: updatedStatus })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === selectedTask.id
              ? { ...task, status: updatedStatus }
              : task
          )
        );
        setStatusModalOpen(false);
        setSelectedTask(null);
        toast.success("✅ Update Status successful!");
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        toast.error(err || "Failed to update status");
      });
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

      <TaskTable tasks={tasks} openStatusModel={openStatusModel} />

      {statusModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-btn"
              onClick={() => setStatusModalOpen(false)}
            >
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
