# Career Advisor

> A full-stack web application that helps users discover, assess, and plan career paths using AI-powered recommendations and interactive roadmaps.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Career Advisor** is a full-stack web application designed to guide users through discovering, evaluating, and planning their career journeys. It combines a high-performance FastAPI backend for career data and AI embeddings with a modern, accessible React frontend — delivering a seamless, intelligent career planning experience.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10 | Core language (Dockerized) |
| FastAPI | REST API framework |
| PyTorch | AI embeddings & recommendations |
| Uvicorn | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |

### DevOps & Tooling
| Technology | Purpose |
|---|---|
| Docker | Backend containerization |
| Node.js & npm | Frontend dependency management |
| Lovable | Optional cloud IDE / deployment |

---

## Features

- **User Authentication** — Secure login and personalized dashboard
- **Career Assessment Quiz** — Interactive quiz with intelligent helpers
- **AI-Powered Recommendations** — Personalized career suggestions via embeddings
- **Interactive Career Roadmaps** — Visual, step-by-step career path planning
- **Dark Mode & Theming** — Full dark mode support with a theme switcher
- **Responsive & Accessible UI** — Built with shadcn/ui for accessibility compliance
- **Modular Codebase** — Scalable, maintainable structure across frontend and backend
- **REST API** — Clean API layer for career data and embedding services
- **Dockerized Backend** — Easy, portable deployment out of the box

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) installed, **or** Python 3.10+ for local backend
- [Node.js](https://nodejs.org/) (v18+ recommended) and npm

---

### Backend Setup

**Option A — Run with Docker (recommended)**

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd career-advisor-v2/backend

# Build the Docker image
docker build -t career-advisor-backend .

# Run the container
docker run -p 7860:7860 career-advisor-backend
```

**Option B — Run locally**

```bash
cd career-advisor-v2/backend

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload --port 7860
```

The backend will be available at `http://localhost:7860`.

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd career-advisor-v2/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

---

## Project Structure

```
career-advisor-v2/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Docker configuration
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Application pages
    │   └── main.tsx         # React entry point
    ├── package.json
    └── vite.config.ts
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with FastAPI, React, and PyTorch</p>
