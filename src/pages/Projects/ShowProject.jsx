import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api"; // adjust path as needed
import "./ShowProject.css";
import MilestonesSection from "../../components/milestones/MilestonesSection";

const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 0 },
  { label: "High", value: 2 },
];

const STATUS_OPTIONS = [
  { label: "Active", value: 0 },
  { label: "planned", value: 1 },
  { label: "On Hold", value: 2 },
  { label: "Completed", value: 3 },
  { label: "Cancelled", value: 4 },
  { label: "Archived", value: 5 },
];

const STATUS_LABELS = {
  pending: { label: "Pending", color: "#f59e0b" },
  in_progress: { label: "In Progress", color: "#4f8cff" },
  completed: { label: "Completed", color: "#10b981" },
};
function statusBadge(status) {
  const info = STATUS_LABELS[status] || { label: status, color: "#888" };
  return (
    <span style={{
      background: info.color,
      color: "#fff",
      borderRadius: 8,
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: 13,
      marginLeft: 8,
    }}>{info.label}</span>
  );
}

function priorityLabel(val) {
  if (typeof val === "string") {
    // Capitalize first letter
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  const found = PRIORITY_OPTIONS.find((o) => o.value === Number(val));
  return found ? found.label : val;
}

function statusLabel(val) {
  if (typeof val === "string") {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  const found = STATUS_OPTIONS.find((o) => o.value === Number(val));
  return found ? found.label : val;
}

const LogoSVG = ({ onClick }) => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 38 38" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: "pointer" }}
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

const SaveSVG = ({ onClick }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: "pointer", marginLeft: "8px" }}
  >
    <path d="M5 12L10 17L20 7" stroke="#4f8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditSVG = ({ onClick }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: "pointer", marginLeft: "8px" }}
  >
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState([]);

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

  useEffect(() => {
    const fetchUpcomingMilestones = async () => {
      try {
        const res = await API.get(`/projects/${id}/milestones/upcomming`);
        setUpcomingMilestones(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        setUpcomingMilestones([]);
      }
    };
    fetchUpcomingMilestones();
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
 
  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    try {
      await API.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    } 
  };

  const handleUserSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) return;
    try {
      await API.put(`/projects/${id}/assign_users`, {
        user_ids: selectedUsers,
        role: selectedRole,
      });
      const res = await API.get(`/projects/${id}`);
      setTeamMembers(res.data.project.assignedUsers);
    } catch (error) {
      console.error("Failed to invite users:", error);
    }
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
      state: { projectId: id, tasks: tasks },
    });
  };

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async () => {
    if (!editingField || !project) return;

    try {
      const updatedProject = { ...project, [editingField]: tempValue };
      await API.put(`/projects/${id}`, updatedProject);
      setProject(updatedProject);
      setEditingField(null);
      setTempValue("");
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setTempValue(Number(e.target.value));
  };

  const handleStatusChange = (e) => {
    setTempValue(Number(e.target.value));
  };

  if (!project) return <div className="premium-bg project-bg"><div className="project-glass-card loading">Loading...</div></div>;

  // Progress calculation (placeholder)
  const progress = 30;

  const openDeleteConfirm = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete(`/projects/${projectToDelete.id}`);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

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
            {editingField === 'name' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleChange}
                  className="edit-input"
                  autoFocus
                />
                <SaveSVG onClick={handleSave} />
                <LogoSVG onClick={cancelEditing} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="project-title">{project.name}</span>
                <EditSVG onClick={() => startEditing('name', project.name)} />
              </div>
            )}
          </div>
          <div className="header-actions">
            <button onClick={goToTicketsDashboard} className="dashboard-btn premium-btn">Go to Tickets Dashboard</button>
            <button className="invite-btn premium-btn" onClick={openInviteModal}>Invite User</button>
          </div>
        </div>
        
        {editingField === 'description' ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <textarea
              value={tempValue}
              onChange={handleChange}
              className="edit-textarea"
              autoFocus
            />
            <SaveSVG onClick={handleSave} />
            <LogoSVG onClick={cancelEditing} />
          </div>
        ) : (
          <p className="project-description" onClick={() => startEditing('description', project.description)}>
            {project.description}
            <EditSVG onClick={() => startEditing('description', project.description)} />
          </p>
        )}
        
        {/* Metadata */}
        <div className="details-grid">
          <div className="detail-card">
            <h4>Start Date</h4>
            {editingField === 'start_date' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="date"
                  value={tempValue}
                  onChange={handleChange}
                  className="edit-input"
                  autoFocus
                />
                <button onClick={handleSave}>☑️</button>
                <button onClick={cancelEditing}>❌</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p onClick={() => startEditing('start_date', project.start_date)}>{project.start_date}</p>
                <EditSVG onClick={() => startEditing('start_date', project.start_date)} />
              </div>
            )}
          </div>
          <div className="detail-card">
            <h4>End Date</h4>
            {editingField === 'end_date' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="date"
                  value={tempValue}
                  onChange={handleChange}
                  className="edit-input"
                  autoFocus
                />
                <button onClick={handleSave}>☑️</button>
                <button onClick={cancelEditing}>❌</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p onClick={() => startEditing('end_date', project.end_date)}>{project.end_date}</p>
                <EditSVG onClick={() => startEditing('end_date', project.end_date)} />
              </div>
            )}
          </div>
          <div className="detail-card">
            <h4>Priority</h4>
            {editingField === 'priority' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  value={tempValue}
                  onChange={handlePriorityChange}
                  className="edit-select"
                  autoFocus
                >
                  {PRIORITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <SaveSVG onClick={handleSave} />
                <LogoSVG onClick={cancelEditing} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p onClick={() => startEditing('priority', project.priority)}>{priorityLabel(project.priority)}</p>
                <EditSVG onClick={() => startEditing('priority', project.priority)} />
              </div>
            )}
          </div>
          <div className="detail-card">
            <h4>Status</h4>
            {editingField === 'status' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  value={tempValue}
                  onChange={handleStatusChange}
                  className="edit-select"
                  autoFocus
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <SaveSVG onClick={handleSave} />
                <LogoSVG onClick={cancelEditing} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p onClick={() => startEditing('status', project.status)}>{project.status}</p>
                <EditSVG onClick={() => startEditing('status', project.status)} />
              </div>
            )}
          </div>
          <div className="detail-card">
            <h4>Client</h4>
            {editingField === 'client_name' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleChange}
                  className="edit-input"
                  autoFocus
                />
                <SaveSVG onClick={handleSave} />
                <LogoSVG onClick={cancelEditing} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p onClick={() => startEditing('client_name', project.client_name)}>{project.client_name}</p>
                <EditSVG onClick={() => startEditing('client_name', project.client_name)} />
              </div>
            )}
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
            <h4>Review</h4>
            <p>{project.reviewTasks}</p>
          </div>
        </div>
        
        {/* Upcoming Milestones Preview */}
        <div style={{ margin: "2.5rem 0 1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h4 className="section-header" style={{ fontWeight: 700, fontSize: 18, margin: 0 }}><span title="Upcoming Milestones">📌</span> Upcoming Milestones</h4>
            <Link to={`/projects/${id}/milestones`} style={{ background: "#4f8cff", color: "#fff", borderRadius: 8, padding: "6px 16px", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>Manage Milestones</Link>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {upcomingMilestones.length === 0 ? (
              <li style={{ color: "#fff", fontSize: 15 }}>No upcoming milestones.</li>
            ) : (
              upcomingMilestones.map(m => (
                <li key={m.id} style={{ fontSize: 15, color: "#23273a", marginBottom: 6, display: "flex", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{m.title}</span>
                  <span style={{ color: "#fff", marginLeft: 10, fontSize: 13 }}>({m.due_date})</span>
                </li>
              ))
            )}
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
        © 2025 Ticket Board &nbsp;|&nbsp; <a href="#">Terms</a> &nbsp;|&nbsp; <a href="#">Privacy Policy</a>| <span className="pointer" onClick={() => openDeleteConfirm(project)}>Delete this project</span>
      </footer>

      {showDeleteConfirm && (
        <div className="modal-overlay premium-modal-overlay">
          <div className="modal-content premium-modal-content" style={{textAlign:'center'}}>
            <h3 style={{color:'#fff', fontWeight:800, fontSize:'1.35rem', marginBottom:'1.5rem'}}>Are you sure you want to delete this project?</h3>
            <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button className="premium-btn" style={{background:'#ff6384',color:'#fff'}} onClick={handleDeleteConfirmed}>Yes, Delete</button>
              <button className="modal-btn-secondary" onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProject;