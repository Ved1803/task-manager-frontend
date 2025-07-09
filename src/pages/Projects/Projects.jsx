import React, { useEffect, useState } from "react";
import "./Projects.css";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Status options and label function (copied from ShowProject.jsx for consistency)
const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Planned", value: "planned" },
  { label: "On Hold", value: "on_hold" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Archived", value: "archived" },
];

function statusLabel(val) {
  if (typeof val === "string") {
    // Capitalize first letter
    const found = STATUS_OPTIONS.find((o) => o.value === val);
    return found ? found.label : val.charAt(0).toUpperCase() + val.slice(1);
  }
  const found = STATUS_OPTIONS.find((o) => o.value === val);
  return found ? found.label : val;
}

const Projects = () => {
  const [groupedProjects, setGroupedProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedProjects, setDeletedProjects] = useState([]);
  
  const fetchGroupedProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/projects/grouped_by_status");
      setGroupedProjects(res.data || {});
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedProjects = async () => {
    try {
      const res = await API.get("/projects/deleted_projects");
      setDeletedProjects(res.data || []);
    } catch (err) {
      // Don't block main UI if this fails
      setDeletedProjects([]);
    }
  }

  const restoreProject = async (id) => {
    try {
      const res = await API.post(`/projects/${id}/restore`);
      const message = res.data?.message
      fetchDeletedProjects();
      toast.success(message);
    } catch (err) {
      toast.error("Failed to restore project.");
    }
  }

  useEffect(() => {
    fetchGroupedProjects();
    fetchDeletedProjects();
  }, []);

  // Only show statuses that have projects
  const statusesWithProjects = Object.keys(groupedProjects).filter(
    (status) => Array.isArray(groupedProjects[status]) && groupedProjects[status].length > 0
  );

  return (
    <>
      <div className="project-header">
        <Link to="/projects/new" className="create-button">
          + Create Project
        </Link>
      </div>
      {loading ? (
        <div className="project-loading">Loading projects...</div>
      ) : error ? (
        <div className="project-error">{error}</div>
      ) : (
        <div className="grouped-projects-container premium-bg">
          {statusesWithProjects.length === 0 && (
            <div className="no-projects-msg">No projects found.</div>
          )}
          {statusesWithProjects.map((status) => (
            <div key={status} className="status-section premium-glass-card">
              <h2 className="status-title">{statusLabel(status)}</h2>
              <div className="project-grid-container">
                {groupedProjects[status].map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="project-box-link"
                  >
                    <div className="project-box">
                      <div className="project-name">{project.name}</div>
                      {project.client_name && (
                        <div className="project-client">{project.client_name}</div>
                      )}
                      {/* Add more metadata if desired */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Deleted Projects Section */}
      {deletedProjects.length > 0 && (
        <div className="deleted-section premium-glass-card">
          <h2 className="deleted-title">Deleted Projects</h2>
          <div className="project-grid-container">
            {deletedProjects.map((project) => (

              <div key={project.id} className="project-box deleted-project-box">
                <div className="project-name">{project.name}</div>
                {project.client_name && (
                  <div className="project-client">{project.client_name}</div>
                )}
                <button className="premium-btn" onClick={() => restoreProject(project.id)}>Restore</button>
              </div>

            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
