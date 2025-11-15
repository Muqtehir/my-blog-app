import React from "react";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const email = "izzatudeenmuqtehir@gmail.com";
  const whatsappNumber = "2347032962346"; // International format

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        background: "linear-gradient(135deg, #6b46c1, #3b82f6, #f43f5e)",
        color: "#fff",
        textAlign: "center",
        borderRadius: "1rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h1
        style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Contact Me
      </h1>
      <p
        style={{ fontSize: "1.25rem", maxWidth: "500px", marginBottom: "2rem" }}
      >
        I’d love to hear from you! Reach out to me via email or WhatsApp and
        I’ll get back to you as soon as possible.
      </p>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Email */}
        <a
          href={`mailto:${email}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#fff",
            color: "#6b46c1",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaEnvelope /> Email Me
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#25D366",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaWhatsapp /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Contact;
