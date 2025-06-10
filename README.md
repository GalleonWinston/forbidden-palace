# IoT-Based Intelligent Waste Management System

This is the official repository for the XJTLU SURF 2025 project on developing an intelligent waste management system. This system uses an ESP32 microcontroller and sensors to monitor waste levels and gas emissions, sending data to a user-friendly web interface.

## Team Members

Our team is composed of students with diverse skills, each contributing to a specific part of the project.

| Name | Role |
| :--- | :--- |
| **Yuexin Li** | Hardware Specialist |
| **Zhongyi Wang** | Hardware Specialist |
| **Jiayi Hu** | Embedded Systems Lead |
| **Zihan Ni** | API & Embedded Integration Lead |
| **Cleon Harada** | Data & Frontend Developer |
| **Tingyuan Shao** | Data & Frontend Developer |
| **Junyue Huang** | Frontend Lead |
| **Zhiheng Liu** | Project Integrator & QA Lead |
| **Karim Moussa** | Principal Investigator / Supervisor |

## Project Overview

The goal of this project is to develop a simple, smart waste monitoring system using everyday technology. We are building a device that measures how full a bin is and detects methane gas, a harmful byproduct of trash. This information is sent wirelessly to a website, where anyone can see the real-time status. By showing when bins are full, we aim to help waste collection become more efficient and reduce environmental impact.

## Tech Stack

This project uses a combination of hardware and software technologies to achieve its goals:

* **Hardware:** ESP32 Microcontroller, HC-SR04 Ultrasonic Sensor, MQ-4 Gas Sensor
* **Embedded:** The code running on our hardware is written in C++ via the Arduino IDE.
* **Backend:** The 'brain' of our server-side operations, built with Node.js or Python (for the API) and using Firebase Realtime Database for data storage.
* **Frontend:** The user-facing website is built with HTML, CSS, and JavaScript.
* **Development:** We use Git for version control and GitHub for collaboration and code hosting.

***

## Getting Started

This section will guide you through setting up the project on your own computer so you can start developing.

### Prerequisites

Before you begin, please ensure you have the following ready:

* **Git Installed:** Git is the version control system we use to track changes in our code. You can check if it's installed by opening a terminal and typing `git --version`.
* **GitHub Account:** You need a personal GitHub account to collaborate with the team.
* **Collaborator Access:** You must accept the invitation sent to your email to gain write access to this repository.
* **Software:**
    * **Arduino IDE:** Make sure it has the ESP32 board support package installed. This allows you to write and upload code to our microcontroller.
    * **Node.js or Python:** Required for running the API server locally.
    * **A modern web browser:** Such as Google Chrome or Mozilla Firefox for viewing the web interface.

### Setup Instructions

1.  **Clone the Repository:** This command downloads a full copy of the project to your computer. Open your terminal or command prompt and run:
    ```bash
    git clone https://github.com/Karim6684xj/SURF-SE-Intelligent-Waste-System-IoT
    ```

2.  **Navigate to the Directory:** Change your current location in the terminal to the newly created project folder.
    ```bash
    cd SURF-SE-Intelligent-Waste-System-IoT
    ```

3.  **Install Dependencies:** Our project has separate parts (the API and the Frontend). Each part has its own dependencies. Follow the specific setup instructions in the `api/` and `frontend/` sub-directories to install them.

***

## Development Workflow

To ensure we can all work together without creating conflicts or breaking the main codebase, we will follow a standard professional workflow. **All work must be done on a personal `feature` branch and then merged into the `develop` branch through a Pull Request.**

### The Core Idea

Think of our repository as having different levels of stability:

* **`main` branch:** This branch is like a "release" version. It only contains code that is stable and has been fully tested at the end of each two-week sprint. **Never work directly on this branch.**
* **`develop` branch:** This is our main "work-in-progress" branch. All of our individual work gets combined here. It should work most of the time, but we test our combined features here. **Never work directly on this branch either.**
* **`feature` branches:** This is your personal workspace. For every new task you start, you will create your own "feature" branch. This allows you to work and make mistakes without affecting anyone else.

### The Daily Workflow: A Step-by-Step Guide

Follow these steps for every new task you are assigned in GitHub Issues.

#### Step 1: Get the Latest Code

Before you write a single line of code, you must ensure your local `develop` branch is perfectly in sync with the team's progress on GitHub.

1.  Switch to your local `develop` branch:
    ```bash
    git checkout develop
    ```
2.  Pull the latest changes from GitHub:
    ```bash
    git pull origin develop
    ```

#### Step 2: Create Your New Task Branch

1.  Go to the **Issues** tab on GitHub and find the task assigned to you (e.g., Issue #15).
2.  From your now up-to-date `develop` branch, create a new branch for your task. It's a good practice to name it clearly.
    ```bash
    # This command creates a new branch and switches to it in one step.
    # Example for working on Issue #15, the API endpoints:
    git checkout -b feature/api-endpoints-15
    ```

#### Step 3: Do Your Work (The Code-Commit Loop)

This is the creative part where you write code and test your feature. As you make progress, save your work in small, logical chunks called "commits."

1.  **Stage your changes:** After you've saved your files, you need to tell Git which changes you want to include in your next commit.
    ```bash
    # This command stages all modified files in the current directory.
    git add .
    ```
2.  **Commit your changes:** Save your staged changes with a clear message explaining what you did.
    ```bash
    # A good commit message explains the "what" and "why" of your change.
    # Using "Closes #15" will automatically link this commit to the issue!
    git commit -m "feat: Implement GET endpoint for sensor data. Closes #15"
    ```

#### Step 4: Push Your Branch to GitHub

When you're ready to share your work, push your local feature branch up to the GitHub repository.

```bash
# The '-u origin' part sets up a tracking connection and is only needed the first time you push a new branch.
git push -u origin feature/api-endpoints-15
