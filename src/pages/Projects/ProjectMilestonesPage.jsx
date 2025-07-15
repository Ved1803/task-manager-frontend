import React from "react";
import { useParams, Link } from "react-router-dom";
import MilestonesSection from "../../components/milestones/MilestonesSection";

const ProjectMilestonesPage = () => {
  const { id } = useParams();
  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", padding: "2.5rem 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px rgba(60,72,100,0.13)", padding: 32 }}>
        <Link to={`/projects/${id}`} style={{ textDecoration: "none", color: "#4f8cff", fontWeight: 600, fontSize: 15, marginBottom: 18, display: "inline-block" }}>← Back to Project</Link>
        <MilestonesSection projectId={id} />
      </div>
    </div>
  );
};

export default ProjectMilestonesPage; 