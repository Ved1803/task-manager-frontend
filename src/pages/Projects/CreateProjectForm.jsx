import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./CreateProjectForm.css";

const STATUS_OPTIONS = [
  { label: "Active", value: 0 },
  { label: "Planned", value: 1 },
  { label: "On Hold", value: 2 },
  { label: "Completed", value: 3 },
  { label: "Cancelled", value: 4 },
  { label: "Archived", value: 5 },
];
const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 0 },
  { label: "High", value: 2 },
];

const CreateProjectForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: 0,
    start_date: "",
    end_date: "",
    priority: 0,
    budget: "",
    client_name: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status" || name === "priority") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { project: form });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="project-form-page premium-bg">
      <form onSubmit={handleSubmit} className="project-form premium-glass-card">
        <h2 className="form-title">Create New Project</h2>
        <div className="input-group">
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="Enter project name"
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field textarea-field"
            required
            placeholder="Describe your project..."
          />
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-field select-field"
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input-field select-field"
              required
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Budget</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="input-field"
              min="0"
              step="0.01"
              placeholder="Enter budget"
            />
          </div>
          <div className="input-group">
            <label>Client Name</label>
            <input
              type="text"
              name="client_name"
              value={form.client_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter client name"
            />
          </div>
        </div>
        <button type="submit" className="gradient-btn">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
