import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

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

const MilestoneModal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(initial || { title: "", description: "", due_date: "" });
  useEffect(() => { if (open) setForm(initial || { title: "", description: "", due_date: "" }); }, [open, initial]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, minWidth: 340, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 32, position: "relative" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>{initial ? "Edit Milestone" : "Create Milestone"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ padding: 10, borderRadius: 8, border: "1.5px solid #7f9cf5" }} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ padding: 10, borderRadius: 8, border: "1.5px solid #7f9cf5", minHeight: 60 }} />
          <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} style={{ padding: 10, borderRadius: 8, border: "1.5px solid #7f9cf5" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#eee", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4f8cff", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{initial ? "Save" : "Create"}</button>
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }} title="Close">×</button>
      </div>
    </div>
  );
};

const MilestonesSection = ({ projectId }) => {
  const [milestones, setMilestones] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMilestone, setEditMilestone] = useState(null);

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const [allRes, upRes] = await Promise.all([
        API.get(`/projects/${projectId}/milestones`),
        API.get(`/projects/${projectId}/milestones/upcomming`),
      ]);
      setMilestones(allRes.data || []);
      setUpcoming(upRes.data || []);
    } catch (err) {
      toast.error("Failed to fetch milestones");
    }
    setLoading(false);
  };

  useEffect(() => { fetchMilestones(); }, [projectId]);

  const handleCreate = async (data) => {
    try {
      await API.post(`/projects/${projectId}/milestones`, data);
      toast.success("Milestone created!");
      setModalOpen(false);
      fetchMilestones();
    } catch {
      toast.error("Failed to create milestone");
    }
  };

  const handleEdit = async (data) => {
    try {
      await API.patch(`/projects/${projectId}/milestones/${editMilestone.id}`, data);
      toast.success("Milestone updated!");
      setEditMilestone(null);
      fetchMilestones();
    } catch {
      toast.error("Failed to update milestone");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this milestone?")) return;
    try {
      await API.delete(`/projects/${projectId}/milestones/${id}`);
      toast.success("Milestone deleted!");
      fetchMilestones();
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  return (
    <div style={{ margin: "2.5rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h3 style={{ fontWeight: 700, fontSize: 22 }}>Milestones</h3>
        <button onClick={() => { setEditMilestone(null); setModalOpen(true); }} style={{ background: "#4f8cff", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>+ Add Milestone</button>
      </div>
      {loading ? <div>Loading milestones...</div> : (
        <>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Upcoming</h4>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {upcoming.length === 0 ? <span>No upcoming milestones.</span> : upcoming.map(m => (
                <div key={m.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(60,72,100,0.08)", padding: 18, minWidth: 220, maxWidth: 320, flex: 1, marginBottom: 8, borderLeft: `6px solid ${STATUS_LABELS[m.status]?.color || '#888'}` }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{m.title} {statusBadge(m.status)}</div>
                  <div style={{ color: "#888", fontSize: 14, margin: "6px 0 8px 0" }}>{m.description}</div>
                  <div style={{ fontSize: 13, color: "#4f8cff" }}>Due: {m.due_date}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 8 }}>All Milestones</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {milestones.length === 0 ? <span>No milestones yet.</span> : milestones.map(m => (
                <div key={m.id} style={{ background: "#f7faff", borderRadius: 10, boxShadow: "0 1px 4px rgba(60,72,100,0.06)", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{m.title} {statusBadge(m.status)}</div>
                    <div style={{ color: "#888", fontSize: 13, margin: "4px 0 6px 0" }}>{m.description}</div>
                    <div style={{ fontSize: 13, color: "#4f8cff" }}>Due: {m.due_date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditMilestone(m); setModalOpen(true); }} style={{ background: "#eee", color: "#4f8cff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(m.id)} style={{ background: "#ff6384", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <MilestoneModal open={modalOpen} onClose={() => { setModalOpen(false); setEditMilestone(null); }} onSave={editMilestone ? handleEdit : handleCreate} initial={editMilestone} />
    </div>
  );
};

export default MilestonesSection; 