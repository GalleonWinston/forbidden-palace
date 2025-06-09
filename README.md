IoT-Based Intelligent Waste Management System
This is the official repository for the XJTLU SURF 2025 project on developing an intelligent waste management system. This system uses an ESP32 microcontroller and sensors to monitor waste levels and gas emissions, sending data to a user-friendly web interface.

Team Members
Name	Role
Yuexin Li	Hardware Specialist
Zhongyi Wang	Hardware Specialist
Jiayi Hu	Embedded Systems Lead
Zihan Ni	API & Embedded Integration Lead
Cleon Harada	Data & Frontend Developer
Tingyuan Shao	Data & Frontend Developer
Junyue Huang	Frontend Lead
Zhiheng Liu	Project Integrator & QA Lead
Karim Moussa	Principal Investigator / Supervisor

Export to Sheets
Project Overview
This project develops a simple, smart waste monitoring system using everyday technology. We built a device that measures how full a bin is and detects methane gas, a harmful byproduct of trash. This information is sent wirelessly to a website, where anyone can see the real-time status. By showing when bins are full, we aim to help waste collection become more efficient and reduce environmental impact.

Tech Stack
Hardware: ESP32 Microcontroller, HC-SR04 Ultrasonic Sensor, MQ-4 Gas Sensor
Embedded: C++ via Arduino IDE
Backend: Node.js / Python (for API), Firebase Realtime Database
Frontend: HTML, CSS, JavaScript
Development: Git & GitHub
Getting Started
Follow these instructions to get the project set up on your local machine for development and testing.

Prerequisites
Git Installed: Make sure you have Git installed on your computer.
GitHub Account: You must have a GitHub account.
Collaborator Access: Ensure you have accepted the collaborator invitation for this repository.
Software:
Arduino IDE with ESP32 board support.
Node.js or Python for running the API server locally.
A modern web browser (e.g., Chrome, Firefox).
Setup Instructions
Clone the Repository: Open your terminal or command prompt and clone the project to your local machine.
Bash

git clone https://github.com/YOUR-ORG/iot-waste-management.git
Navigate to the Directory:
Bash

cd iot-waste-management
Install Dependencies: Follow the setup instructions in the api/ and frontend/ sub-directories (if applicable).
Development Workflow
To ensure our project code stays stable and organized, we will follow a standard professional workflow. All work must be done on a feature branch and merged into develop through a Pull Request.

The Core Idea
main branch: Contains the stable, working version of our project at the end of each two-week sprint. Never work directly on this branch.
develop branch: Our main integration branch where all daily work gets merged. Never work directly on this branch either.
feature branches: Where you do all your work. For every new task, you will create your own "feature" branch.
The Daily Workflow: Step-by-Step
Follow these steps for every new task you are assigned in GitHub Issues.

Step 1: Get the Latest Code
Before you start any new work, you must update your local develop branch.

Switch to your local develop branch:
Bash

git checkout develop
Pull the latest changes from GitHub:
Bash

git pull origin develop
Step 2: Create Your New Task Branch
Look at the Issues tab on GitHub and find the task assigned to you (e.g., Issue #15).
From your up-to-date develop branch, create a new branch for your task. Use a clear name that includes the feature and the issue number.
Bash

# Example for working on Issue #15, the API endpoints
git checkout -b feature/api-endpoints-15
Step 3: Do Your Work (The Code-Commit Loop)
This is where you write your code and test your work. As you make progress, save it by making small, logical commits.

Stage your changes: Add the files you have worked on.
Bash

git add .
Commit your changes: Write a clear commit message. Start your message with a keyword like feat:, fix:, or docs: and mention the issue number you are working on.
Bash

git commit -m "feat: Implement GET endpoint for sensor data. Closes #15"
Step 4: Push Your Branch to GitHub
When you are ready to share your work, push your feature branch to the remote repository.

Bash

# The '-u' is only needed the very first time you push a new branch
git push -u origin feature/api-endpoints-15
Step 5: Create a Pull Request (PR)
A Pull Request is how you ask for your work to be reviewed and merged into the develop branch.

Go to the repository on GitHub. You will usually see a yellow banner with your branch name and a button that says "Compare & pull request". Click it.
On the "Open a pull request" page:
Base: develop (This is where you want to merge into).
Compare: feature/api-endpoints-15 (This is your branch).
Title: Give your PR a clear title.
Description: Briefly explain what you did and how to test it. Mention the issue number again (Closes #15).
Reviewers: On the right-hand side, assign at least one teammate to review your code.
Click Create pull request.
Step 6: Code Review, Discussion, and Merging
Your reviewer will look at your code and may suggest changes.
If you need to make changes, simply go back to Step 3, make more commits, and git push to the same feature branch. The Pull Request will update automatically.
Once your reviewer approves your changes, a "Merge pull request" button will be available. Click it.
Confirm the merge and then click the "Delete branch" button to keep the repository clean.
Congratulations! Your work is now safely in the develop branch. You are ready to go back to Step 1 for your next task.
