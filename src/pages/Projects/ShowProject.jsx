import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api"; // adjust path as needed
import "./ShowProject.css";

const ShowProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(id, "check id");
        const res = await API.get(`/projects/${id}`);
        setProject(res.data.project);
        console.log(res.data);
        setTasks(res.data.project.tasks);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id]);

  const openInviteModal = async () => {
    setShowInviteModal(true);
    try {
      const response = await API.get("/users");
      const userOptions = response.data.map((user) => ({
        name: user.name,
        id: user.id,
      }));

      const data = userOptions; // mocked for now
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleUserSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    try {
      await API.put(`/projects/${id}/assign_users`, {
        user_ids: selectedUsers,
      });

      alert("Users invited successfully!");
      setShowInviteModal(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Failed to invite users", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const goToTicketsDashboard = () => {
    navigate(`/projects/${id}/tasks`, {
      state: { projectId: id, tasks: tasks },    });
  };

  if (!project) return <p>Loading...</p>;

  return (
<div className="project-page">

      {/* Header */}
      <div className="header">
        <div className="project-title">{project.name}</div>
        <div className="header-actions">
          <button onClick={goToTicketsDashboard} className="dashboard-btn">Go to Tickets Dashboard</button>
          <button className="invite-btn" onClick={openInviteModal}>+ Invite User</button>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Invite Users to Project</h3>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="user-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="user-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                    />
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="invite-btn" onClick={handleInvite}>Invite Selected</button>
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <p className="description">
       {project.description}
      </p>

      {/* Metadata */}
      <div className="details-grid">
        <div className="detail-card">
          <h4>Start Date</h4>
          <p>{project.created_at}</p>
        </div>
        <div className="detail-card">
          <h4>Deadline</h4>
          <p>July 15, 2025</p>
        </div>
        <div className="detail-card">
          <h4>Priority</h4>
          <p>High</p>
        </div>
        <div className="detail-card">
          <h4>Client</h4>
          <p>Acme Corp</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-section">
        <div className="stat-box">
          <h4>Total Tickets</h4>
          <p>{project.totalTasks}</p>
        </div>
        <div className="stat-box">
          <h4>Completed</h4>
          <p>{project.completedTasks}</p>
        </div>
        <div className="stat-box">
          <h4>In Progress</h4>
          <p>{project.inProgressTasks}</p>
        </div>
        <div className="stat-box">
          <h4>Pending</h4>
          <p>{project.pendingTasks}</p>
        </div>
      </div>

      {/* Team Members */}
      <div className="members-section">
        <h4 className="member-label">Team Members</h4>
        <div className="avatars">
          <img src="https://i.pravatar.cc/40?img=11" alt="User 1" className="avatar" />
          <img src="https://i.pravatar.cc/40?img=12" alt="User 2" className="avatar" />
          <img src="https://i.pravatar.cc/40?img=13" alt="User 3" className="avatar" />
          <span className="total-users">+5 more</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">Progress</div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: "70%" }}></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones-section">
        <h4>Upcoming Milestones</h4>
        <ul className="milestone-list">
          <li>🔹 UI Wireframes - Due May 20</li>
          <li>🔹 Backend Integration - Due June 5</li>
          <li>🔹 UAT Testing - Due July 1</li>
        </ul>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <h4>Recent Activity</h4>
        <ul>
          <li>✅ Ved Tiwari closed ticket #105</li>
          <li>👤 New member John added to the project</li>
          <li>📌 Ticket #112 marked as urgent</li>
        </ul>
      </div>
    </div>
  );
};

export default ShowProject;
