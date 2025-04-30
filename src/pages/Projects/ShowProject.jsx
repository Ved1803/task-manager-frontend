import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api"; // adjust path as needed
import "./ShowProject.css";

const ShowProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(id, "check id");
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
        console.log(res, "check project");
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id]);

  const navigate = useNavigate();

  const goToTicketsDashboard = () => {
    navigate(`/projects/${id}/tasks`, {
      state: { projectId: id, tasks: tasks },    });
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="project-details">
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <button onClick={goToTicketsDashboard} className="tickets-button">
        Go to Tickets Dashboard
      </button>
    </div>
  );
};

export default ShowProject;
