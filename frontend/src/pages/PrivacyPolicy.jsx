import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sections = [
    {
      title: "Introduction",
      content: `Welcome to My Blog! This Privacy Policy explains how we collect, use, and protect your personal information. 
      We are committed to ensuring the privacy and security of all our users while providing an engaging blogging experience.`,
    },
    {
      title: "What Data We Collect",
      content: `We collect information that you provide directly to us, including:
      • Name and email address when you create an account
      • Profile information and preferences
      • Content you post, including blogs, comments, and interactions
      • Technical data such as IP address and browser information`,
    },
    {
      title: "How We Use Your Data",
      content: `Your data helps us provide and improve our services:
      • Personalizing your blogging experience
      • Processing and displaying your content
      • Sending important updates and notifications
      • Analyzing site performance and user engagement
      • Preventing fraud and ensuring platform security`,
    },
    {
      title: "Third-Party Services",
      content: `We integrate with trusted third-party services:
      • Google Authentication for secure sign-in
      • Apple Sign-in for iOS users
      • Supabase for data storage and management
      These services have their own privacy policies and security measures.`,
    },
    {
      title: "Your Rights",
      content: `You have control over your data:
      • Access your personal information
      • Request data correction or deletion
      • Export your data
      • Opt-out of non-essential communications
      Contact us to exercise these rights.`,
    },
    {
      title: "Contact Information",
      content: `Questions about your privacy? We're here to help:
      • Email: izzatudeenmuqtehir@gmail.com
      • Support: abefethedoctor@gmail.com
      We aim to respond to all inquiries within 48 hours.`,
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
        variants={sectionVariants}
      >
        Privacy Policy
      </motion.h1>

      <motion.div className="space-y-12" variants={containerVariants}>
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={sectionVariants}
          >
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
              {section.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </motion.section>
        ))}

        <motion.div
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
          variants={sectionVariants}
        >
          Last updated: November 2025
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;
