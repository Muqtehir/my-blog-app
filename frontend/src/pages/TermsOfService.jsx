import React from "react";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
      title: "Acceptance of Terms",
      content: `By accessing and using My Blog, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
      If you do not agree with any part of these terms, you must not use our services.
      These terms apply to all visitors, users, and contributors to our platform.`,
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right to modify these terms at any time without prior notice. 
      Changes will be effective immediately upon posting to our website.
      • We will notify users of material changes via email
      • Continued use of the platform constitutes acceptance of modified terms
      • Users are encouraged to review terms regularly
      It is your responsibility to check for updates to these terms.`,
    },
    {
      title: "User Accounts",
      content: `When creating an account, you agree to:
      • Provide accurate and complete information
      • Maintain the security of your account credentials
      • Accept responsibility for all activities under your account
      • Notify us immediately of any unauthorized access
      
      We reserve the right to suspend or terminate accounts that violate our terms or policies.`,
    },
    {
      title: "Content Ownership",
      content: `Users retain ownership of content they post on My Blog. By posting, you grant us a:
      • Worldwide, non-exclusive license to use your content
      • Right to display, distribute, and modify your content
      • Permission to use your content for promotional purposes
      
      You represent that you have all necessary rights to the content you post.`,
    },
    {
      title: "Limitation of Liability",
      content: `My Blog is provided "as is" without warranties of any kind. We are not liable for:
      • Service interruptions or data loss
      • Damages arising from your use of our platform
      • Third-party content or websites
      • Lost profits or consequential damages
      
      Our total liability shall not exceed the amount paid by you, if any, for using our services.`,
    },
    {
      title: "Termination",
      content: `We may terminate or suspend your access to My Blog:
      • For violations of these terms
      • At our sole discretion without notice
      • If required by law or regulation
      
      Upon termination:
      • Your right to use the platform ceases immediately
      • We may delete your content and account information
      • Some terms survive termination (e.g., content ownership)`,
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
        Terms of Service
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

export default TermsOfService;
