import { useEffect, useState } from "react";
import "./TaskForm.css";
import { useNavigate, useLocation, useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../services/api";

const TaskForm = ({ onTaskCreated }) => {
  const location = useLocation();
  const { projectId: paramProjectId } = useParams();
  const { projectId: stateProjectId } = location.state || {};
  const projectId = stateProjectId || paramProjectId;

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    reported_by: "",
    assigned_to: "",
    priority: "",
    due_date: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    if (!token) navigate("/login");

    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setTask({ ...task, images: files });
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
   
    Object.entries(task).forEach(([key, value]) => {
      if (key === "images") {
        Array.from(value).forEach((img) => data.append("task[images][]", img));
      } else {
        data.append(`task[${key}]`, value);
      }
    });

    data.append("task[project_id]", projectId);

    try {
      const response = await API.post(`projects/:${projectId}/tasks`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onTaskCreated?.(response.data.task);
      toast.success("Task created successfully");
      navigate(`/projects/${projectId}`);

      setTask({
        title: "",
        description: "",
        status: "todo",
        reported_by: "",
        assigned_to: "",
        priority: "low",
        due_date: "",
        category: "",
        images: [],
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Task creation failed");
    }
  };

  return (
    <div className="task-form-bg">
      <form
        className="task-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Create Task</h2>

        <div className="form-group">
          <label htmlFor="title">Title <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            type="text"
            name="title"
            id="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            name="description"
            id="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Task Description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            name="status"
            id="status"
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="review">Review</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            name="priority"
            id="priority"
            value={task.priority}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={task.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            value={task.category}
            onChange={handleChange}
            placeholder="Category"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reported_by">Reported By</label>
          <select
            name="reported_by"
            id="reported_by"
            value={task.reported_by}
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assigned_to">Assign To</label>
          <select
            name="assigned_to"
            id="assigned_to"
            value={task.assigned_to}
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
