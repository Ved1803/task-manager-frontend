import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api"; // adjust path as needed
import "./ShowProject.css";


const LogoSVG = ({ onClick }) => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 38 38" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: "pointer" }}  // So it looks clickable
  >
    <circle cx="19" cy="19" r="19" fill="url(#paint0_linear)"/>
    <path d="M12 26L26 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M12 12L26 26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4f8cff"/>
        <stop offset="1" stopColor="#7f9cf5"/>
      </linearGradient>
    </defs>
  </svg>
);

const ShowProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("member");
  const [teamMembers, setTeamMembers] = useState([]); //assignedUsers

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(id, "check id");
        const res = await API.get(`/projects/${id}`);
        setProject(res.data.project);
        console.log(res.data);
        setTasks(res.data.project.tasks);
        setTeamMembers(res.data.project.assignedUsers);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id]);

  const openInviteModal = async () => {
    try {
      const response = await API.get("/users");
      const userOptions = response.data.map((user) => ({
        name: user.name,
        id: user.id,
      }));
      setUsers(userOptions);
    } catch (error) {
      setUsers([
        { id: 1, name: "Ved Tiwari" },
        { id: 2, name: "John Doe" },
        { id: 3, name: "Jane Smith" },
      ]);
    }
    setShowInviteModal(true);
  };

  const handleUserSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    setShowInviteModal(false);
    setSelectedUsers([]);
    setSelectedRole("member");
  };

  const filteredUsers = users.filter(
    u => u?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const goToTicketsDashboard = () => {
    navigate(`/projects/${id}/tasks`, {
      state: { projectId: id, tasks: tasks },    });
  };

  if (!project) return <div className="premium-bg project-bg"><div className="project-glass-card loading">Loading...</div></div>;

  // Progress calculation (placeholder)
  const progress = 30;

  return (
    <div className="premium-bg project-bg">
      {/* SVG background shapes */}
      <svg className="bg-shape bg-shape-1" width="400" height="400" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="200" fill="url(#ellipse1)" fillOpacity="0.18"/><defs><linearGradient id="ellipse1" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse"><stop stopColor="#7f9cf5"/><stop offset="1" stopColor="#4f8cff"/></linearGradient></defs></svg>
      <svg className="bg-shape bg-shape-2" width="300" height="300" viewBox="0 0 300 300" fill="none"><ellipse cx="150" cy="150" rx="150" ry="150" fill="url(#ellipse2)" fillOpacity="0.13"/><defs><linearGradient id="ellipse2" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#a084ee"/><stop offset="1" stopColor="#7f9cf5"/></linearGradient></defs></svg>
      <div className="project-glass-card">
        {/* Header */}
        <div className="project-header-row">
          <div className="project-logo-title">
          <LogoSVG onClick={() => navigate('/projects')} />
                        <span className="project-title">{project.name}</span>
          </div>
          <div className="header-actions">
            <button onClick={goToTicketsDashboard} className="dashboard-btn premium-btn">Go to Tickets Dashboard</button>
            <button className="invite-btn premium-btn" onClick={openInviteModal}>+ Invite User</button>
          </div>
        </div>
        <p className="project-description">{project.description}</p>
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
          <div className="member-label-row">
            <h4 className="member-label">Team Members</h4>
            <button className="team-modal-btn" onClick={() => setShowTeamModal(true)} title="View all team members">👥</button>
          </div>
          <div className="avatars">
            {teamMembers.slice(0, 5).map((member) => (
              <img
                key={member.id}
                src={member.avatar_url || `https://i.pravatar.cc/40?img=${member.id+10}`}
                alt={member.name}
                className="avatar"
                title={member.name}
                onClick={() => setShowTeamModal(true)}
                tabIndex={0}
                style={{ transition: 'transform 0.15s' }}
              />
            ))}
            {teamMembers.length > 5 && (
              <span className="total-users" onClick={() => setShowTeamModal(true)} tabIndex={0}>
                +{teamMembers.length - 5} more
              </span>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-label">Progress</div>
          <div className="progress-bar premium-progress-bar">
            <div className="progress-bar-fill premium-progress-bar-fill" style={{ width: `${progress}%` }}>
              <span className="progress-percent">{progress}%</span>
            </div>
          </div>
        </div>
        {/* Milestones */}
        <div className="milestones-section">
          <h4 className="section-header"><span title="Upcoming Milestones">📌</span> Upcoming Milestones</h4>
          <ul className="milestone-list">
            <li title="UI Wireframes">🔹 UI Wireframes - Due May 20</li>
            <li title="Backend Integration">🔹 Backend Integration - Due June 5</li>
            <li title="UAT Testing">🔹 UAT Testing - Due July 1</li>
          </ul>
        </div>
        {/* Activity Feed */}
        <div className="activity-feed">
          <h4 className="section-header"><span title="Recent Activity">✅</span> Recent Activity</h4>
          <ul>
            <li title="Closed ticket">✅ Ved Tiwari closed ticket #105</li>
            <li title="New member">👤 New member John added to the project</li>
            <li title="Urgent ticket">📌 Ticket #112 marked as urgent</li>
          </ul>
        </div>
      </div>
      {/* Team Modal */}
      {showTeamModal && (
        <div className="modal-overlay premium-modal-overlay" onClick={() => setShowTeamModal(false)}>
          <div className="modal-content premium-modal-content team-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Team Members</h3>
              <button className="modal-close-btn" onClick={() => setShowTeamModal(false)}>×</button>
            </div>
            
            <div className="modal-search-section">
              <div className="search-input-group">
                <span className="search-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="#a0aec0" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="modal-search-input"
                />
              </div>
            </div>
            
            <div className="modal-user-list">
              {teamMembers
                .filter((user) => user?.name?.toLowerCase().includes(search.toLowerCase()))
                .map((user) => (
                  <div key={user.id} className="modal-user-item" onClick={() => console.log('View profile:', user.name)}>
                    <div className="user-avatar">
                      <img src={user.avatar_url || `https://i.pravatar.cc/40?img=${user.id+10}`} alt={user.name} />
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-role">Team Member</span>
                    </div>
                    <div className="user-actions">
                      <button className="view-profile-btn" title="View Profile">👁️</button>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="modal-footer">
              <button className="modal-close-btn-secondary" onClick={() => setShowTeamModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="modal-overlay premium-modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content premium-modal-content invite-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Invite Users to Project</h3>
              <button className="modal-close-btn" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            
            <div className="modal-search-section">
              <div className="search-input-group">
                <span className="search-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="#a0aec0" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="modal-search-input"
                />
              </div>
            </div>
            
            <div className="modal-user-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="modal-user-item">
                  <label className="user-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="user-checkbox"
                    />
                    <div className="user-avatar">
                      <img src={`https://i.pravatar.cc/40?img=${user.id+10}`} alt={user.name} />
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.name.toLowerCase().replace(' ', '.')}@example.com</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="modal-role-section">
              <div className="role-dropdown-group">
                <span className="role-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="#a0aec0" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </span>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="role-dropdown"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button className="modal-btn-primary" onClick={handleInvite} disabled={selectedUsers.length === 0}>
                Invite Selected ({selectedUsers.length})
              </button>
            </div>
            
            <div className="modal-footer-text">
              By inviting users, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="premium-footer-bar project-footer">
        © 2025 Ticket Board &nbsp;|&nbsp; <a href="#">Terms</a> &nbsp;|&nbsp; <a href="#">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default ShowProject;
