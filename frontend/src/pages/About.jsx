import React from "react";

const About = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #6b46c1, #3b82f6, #f43f5e)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderRadius: "1rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        About Me
      </h1>

      {/* Intro */}
      <p
        style={{ fontSize: "1.25rem", maxWidth: "700px", marginBottom: "2rem" }}
      >
        Hi, I’m <strong> Amir (Mayaleeke Muqtehir Izzatudeen)</strong>
        , a passionate student and budding full-stack developer from Nigeria.
        <br />I created this blog to share my journey in technology,
        programming, and personal growth. Here, you’ll find tutorials, projects,
        and insights into my learning experiences.
      </p>

      {/* Mission / Purpose */}
      <div style={{ maxWidth: "700px", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>My Mission</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          My mission is to inspire others while documenting my own progress. I
          aim to make technology accessible and exciting for everyone who visits
          this blog.
          <br />I also share insights from my projects in web development,and
          also on my journey in becoming a proficient full-stack developer and
          an AI and robotics engineer.
        </p>
      </div>

      {/* Fun / Personal Touch */}
      <div style={{ maxWidth: "700px", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          A Little About Me
        </h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          Outside of coding, I enjoy exploring new tech products, experimenting
          with designs, and learning about AI and robotics.
          <br />I also love keeping up with technology trends and finding
          creative ways to combine tech with real-world projects.
        </p>
      </div>

      {/* Call-to-action */}
      <a
        href="/contact"
        style={{
          backgroundColor: "#fff",
          color: "#6b46c1",
          padding: "0.75rem 2rem",
          borderRadius: "9999px",
          fontWeight: "bold",
          textDecoration: "none",
          fontSize: "1.1rem",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Contact Me
      </a>
    </div>
  );
};

export default About;
