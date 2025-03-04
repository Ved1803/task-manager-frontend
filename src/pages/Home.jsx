
import './Home.css';
const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">

          <h1>Stay Organized, Get More Done!</h1>

        <div>
        <p>
          Your ultimate task management tool to create, track, and complete tasks effortlessly.
          Stay on top of your work with deadlines, priorities, and collaboration features.
        </p>
        <div className="buttons">
          <button className="btn-primary">Get Started for Free</button>
          <button className="btn-secondary">Login</button>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Our Task Manager?</h2>
        <p>
        <ul>
          <li>✅ Simple & Fast – Easily create and manage tasks</li>
          <li>✅ Reminders & Notifications – Stay on top of deadlines</li>
          <li>✅ Priority & Labels – Organize tasks efficiently</li>
          <li>✅ Team Collaboration – Assign tasks & work together</li>
          <li>✅ Progress Tracking – Move tasks through "To-Do," "In Progress," and "Done"</li>
        </ul>
        </p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
      <p>
        <ol>
          <li>🔹 Sign Up & Log In – Create your free account</li>
          <li>🔹 Add Your Tasks – Set due dates, priorities, and categories</li>
          <li>🔹 Track Progress – Move tasks through different stages</li>
          <li>🔹 Achieve More! – Stay productive and never miss a deadline</li>
        </ol>
       </p>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Users Say</h2>
        <blockquote>
          "This task manager has changed how I work! Super easy to use and keeps me on track!"
        </blockquote>
        <blockquote>
          "Finally, a task manager that’s simple yet powerful!"
        </blockquote>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Start Managing Your Tasks Like a Pro!</h2>
        <button className="btn-primary">Sign Up Free</button>
        <button className="btn-secondary">Login Now</button>
      </section>
    </div>
  );
};

export default Home;
