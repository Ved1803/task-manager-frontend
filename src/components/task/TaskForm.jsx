import React, { useState } from "react";
import axios from "axios";
import "./TaskForm.css";

const TaskForm = ({ users = [], token }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    reported_by: "",
    assigned_to: "",
    priority: "low",
    due_date: "",
    category: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((img) =>
          data.append("task[images][]", img)
        );
      } else if (formData[key]) {
        data.append(`task[${key}]`, formData[key]);
      }
    });

    try {
      const response = await axios.post("/api/v1/tasks", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Task created successfully!");
      setFormData({
        title: "",
        description: "",
        status: "pending",
        reported_by: "",
        assigned_to: "",
        priority: "low",
        due_date: "",
        category: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.error ||
          "❌ Something went wrong. Please try again."
      );
    }
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2>Create New Task</h2>

      <label>Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
        required
      />

      <label>Status</label>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="done">Done</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
      </select>

      <label>Priority</label>
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <label>Due Date</label>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <label>Category</label>
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />

      <label>Reported By</label>
      <select
        name="reported_by"
        value={formData.reported_by}
        onChange={handleChange}
      >
        <option value="">Select Reporter</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <label>Assigned To</label>
      <select
        name="assigned_to"
        value={formData.assigned_to}
        onChange={handleChange}
      >
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <label>Attach Images</label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleChange}
      />

      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
