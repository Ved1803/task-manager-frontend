import { Link } from "react-router-dom";
import "./Home.css";
import { useState, useEffect } from "react";
import API from "../services/api";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't fetch if query is empty
    if (query.trim() === "") {
      setProjects([]); // Optionally show nothing when input is empty
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/projects?q=${query}`);
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce input by 300ms
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Human Resources Templates for Confluence</h1>
          <p>
            Use Confluence to get a head start on your team's projects and docs.
          </p>

          <div className="search-bar" style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search for Projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1.2rem",
                fontSize: "1.08rem",
                marginBottom: "1rem",
                borderRadius: "1.5rem",
                border: "1.5px solid #7f9cf5",
                background: "rgba(35, 41, 70, 0.95)",
                color: "#e6eaff",
                outline: "none",
                boxShadow: "0 1.5px 8px 0 rgba(79,140,255,0.08) inset",
              }}
            />
            {/* Modern dropdown for search results */}
            {query.trim() !== "" && (
              <div
                className="search-dropdown premium-glass-card"
                style={{
                  position: "absolute",
                  top: "3.2rem",
                  left: 0,
                  width: "100%",
                  zIndex: 10,
                  background: "rgba(30,32,48,0.97)",
                  borderRadius: "1.5rem",
                  boxShadow: "0 8px 32px rgba(30,32,48,0.18), 0 1.5px 8px 0 rgba(79,140,255,0.08) inset",
                  padding: "0.5rem 0",
                  maxHeight: 320,
                  overflowY: "auto",
                  border: "1.5px solid #7f9cf5",
                }}
              >
                {loading ? (
                  <div className="search-dropdown-item" style={{ color: "#a0aec0", padding: "0.8rem 1.5rem" }}>Loading...</div>
                ) : (
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="search-dropdown-item project-box-link"
                      style={{
                        display: "block",
                        padding: "1rem 1.5rem",
                        color: "#e6eaff",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(127,156,245,0.08)",
                        fontWeight: 600,
                        borderRadius: 0,
                        transition: "background 0.15s, color 0.15s",
                      }}
                      onMouseDown={e => e.preventDefault()} // Prevent input blur on click
                    >
                      <div style={{ fontSize: "1.08rem", fontWeight: 700 }}>{project.name}</div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="info-points">
        <div className="info-item">
          <Link to="https://www.techtarget.com/searchcio/definition/project-planning" >
          <span role="img" aria-label="planning">
            📋
          </span>
          <div>
            <h3>Project Planning</h3>
            <p>
              Plan your projects with clear goals, timelines, and deliverables
              to ensure your team stays on track from start to finish.
            </p>
          </div>
          </Link>
        </div>

        <div className="info-item">
          <span role="img" aria-label="task">
            ✅
          </span>
          <div>
            <h3>Task Assignment</h3>
            <p>
              Break down projects into tasks and assign them to team members
              with clear ownership and due dates.
            </p>
          </div>
        </div>

        <div className="info-item">
          <span role="img" aria-label="progress">
            🔔
          </span>
          <div>
            <h3>Progress Tracking</h3>
            <p>
              Monitor project and task status in real-time, ensuring timely
              updates and proactive management of risks.
            </p>
          </div>
        </div>

        <div className="info-item">
          <span role="img" aria-label="collaboration">
            📈
          </span>
          <div>
            <h3>Team Collaboration</h3>
            <p>
              Enable seamless collaboration by allowing team members to
              contribute ideas, share updates, and work together within project
              pages.
            </p>
          </div>
        </div>

        <div className="info-item">
          <span role="img" aria-label="documents">
            🗂️
          </span>
          <div>
            <h3>Documentation Management</h3>
            <p>
              Centralize all project-related documents, meeting notes, and key
              resources so your team can easily access the information they
              need.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
