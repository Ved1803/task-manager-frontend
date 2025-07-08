import React, { useState } from "react";
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

const EditProjectModal = ({ project, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...project });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "status" || name === "priority" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.patch(`/projects/${project.id}`, form);
      onUpdated(res.data.project || form);
      onClose();
    } catch (err) {
      setError("Failed to update project.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay premium-modal-overlay" onClick={onClose}>
      <div className="modal-content premium-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Project</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="project-form premium-glass-card">
          <div className="input-group">
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="input-field textarea-field"
              required
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
                value={form.start_date || ""}
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
                value={form.end_date || ""}
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
                value={form.budget || ""}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Client Name</label>
              <input
                type="text"
                name="client_name"
                value={form.client_name || ""}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="gradient-btn" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal; 