// backend/utils/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");
  } catch (err) {
    console.error("❌ DB Connection failed", err);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    // 1) Clear old data
    await Application.deleteMany();
    await Job.deleteMany();
    await Company.deleteMany();
    await User.deleteMany();
    console.log("🗑️ Old data removed");

    // 2) Users (hash one password for all demo accounts)
    const password = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      // Students
      { fullname: "Alice Johnson", email: "alice@student.com", phoneNumber: 9876543210, password, role: "student" },
      { fullname: "Bob Smith",     email: "bob@student.com",   phoneNumber: 9123456780, password, role: "student" },
      { fullname: "Eve Clark",     email: "eve@student.com",   phoneNumber: 9001122334, password, role: "student" },
      { fullname: "Frank Wright",  email: "frank@student.com", phoneNumber: 8445566778, password, role: "student" },

      // Recruiters
      { fullname: "Clara Recruiter", email: "clara@recruiter.com", phoneNumber: 9988776655, password, role: "recruiter" },
      { fullname: "David Recruiter", email: "david@recruiter.com", phoneNumber: 8899776655, password, role: "recruiter" },
    ]);
    console.log("👤 Users inserted");

    const [alice, bob, eve, frank, clara, david] = users;

    // 3) Companies (must have name + userId)
    const companies = await Company.insertMany([
      {
        name: "Tech Corp",
        description: "A leading software company",
        website: "https://techcorp.com",
        location: "New York, USA",
        userId: clara._id,
      },
      {
        name: "Startup Hub",
        description: "An innovative startup accelerator",
        website: "https://startuphub.com",
        location: "San Francisco, USA",
        userId: david._id,
      },
      {
        name: "Cloud Nine",
        description: "Cloud-native solutions and services",
        website: "https://cloudnine.example",
        location: "Remote",
        userId: clara._id,
      },
    ]);
    console.log("🏢 Companies inserted");

    const [techCorp, startupHub, cloudNine] = companies;

    // 4) Jobs (salary Number, experienceLevel Number, jobType String, position Number)
    const jobs = await Job.insertMany([
      {
        title: "Frontend Developer",
        description: "Build delightful UIs with React, Vite, Tailwind.",
        requirements: ["React", "Vite", "Tailwind", "JavaScript"],
        salary: 90000,
        experienceLevel: 2,
        location: "Remote",
        jobType: "Full-time",
        position: 3,
        company: techCorp._id,
        created_by: clara._id,
      },
      {
        title: "Backend Developer",
        description: "Design REST APIs with Node.js, Express, MongoDB.",
        requirements: ["Node.js", "Express", "MongoDB", "JWT"],
        salary: 110000,
        experienceLevel: 3,
        location: "San Francisco, USA",
        jobType: "Full-time",
        position: 2,
        company: startupHub._id,
        created_by: david._id,
      },
      {
        title: "UI/UX Designer",
        description: "Create user-centered designs and prototypes.",
        requirements: ["Figma", "Wireframing", "Prototyping"],
        salary: 80000,
        experienceLevel: 2,
        location: "New York, USA",
        jobType: "Full-time",
        position: 1,
        company: techCorp._id,
        created_by: clara._id,
      },
      {
        title: "DevOps Engineer",
        description: "CI/CD, Docker, Kubernetes, monitoring and reliability.",
        requirements: ["Docker", "Kubernetes", "CI/CD", "Linux"],
        salary: 120000,
        experienceLevel: 4,
        location: "Remote",
        jobType: "Full-time",
        position: 2,
        company: cloudNine._id,
        created_by: clara._id,
      },
      {
        title: "Software Intern",
        description: "Assist in building features across the stack.",
        requirements: ["JavaScript", "Git", "Eagerness to learn"],
        salary: 30000,
        experienceLevel: 0,
        location: "Remote",
        jobType: "Internship",
        position: 4,
        company: startupHub._id,
        created_by: david._id,
      },
      {
        title: "Part-time QA Tester",
        description: "Manual testing, bug reporting, basic automation.",
        requirements: ["Testing", "Jest", "Cypress (nice to have)"],
        salary: 40000,
        experienceLevel: 1,
        location: "Remote",
        jobType: "Part-time",
        position: 2,
        company: cloudNine._id,
        created_by: clara._id,
      },
    ]);
    console.log("💼 Jobs inserted");

    const [feDev, beDev, uiux, devops, intern, qaPartTime] = jobs;

    // 5) Applications
    await Application.insertMany([
      // Alice applies to FE + UI/UX
      { job: feDev._id, applicant: alice._id, status: "pending" },
      { job: uiux._id,  applicant: alice._id, status: "accepted" },

      // Bob applies to BE + DevOps
      { job: beDev._id, applicant: bob._id,   status: "pending" },
      { job: devops._id, applicant: bob._id,  status: "rejected" },

      // Eve applies to Intern + QA
      { job: intern._id, applicant: eve._id,  status: "pending" },
      { job: qaPartTime._id, applicant: eve._id, status: "pending" },

      // Frank applies to FE
      { job: feDev._id, applicant: frank._id, status: "pending" },
    ]);
    console.log("📄 Applications inserted");

    console.log("🌱 Seed data inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

seed();
