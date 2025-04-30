import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./CreateProjectForm.css";

const CreateProjectForm = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className="project-form-page">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <label>Project Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
