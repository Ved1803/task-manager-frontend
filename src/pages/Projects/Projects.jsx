import React, { useEffect, useState } from "react";
import "./Projects.css";
import API from "../../services/api";
import CreateProjectForm from "./CreateProjectForm";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div className="project-header">
        <Link to="/projects/new" className="create-button">
          + Create Project
        </Link>
      </div>

      <div className="project-grid-container">
        {projects?.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-box-link"
          >
            <div className="project-box">{project.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Projects;
