import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Human Resources Templates for Confluence</h1>
          <p>
            Use Confluence to get a head start on your team's projects and docs.
          </p>
          <div className="search-bar">
            <input type="text" placeholder="Search for Confluence templates" />
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
