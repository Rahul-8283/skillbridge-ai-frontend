# 🚀 SkillBridge AI

![SkillBridge AI](https://img.shields.io/badge/SkillBridge-AI-0F172A?style=for-the-badge&logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-Graph-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)

**SkillBridge AI** is an intelligent, multi-service platform solving the career-skills gap. It analyzes resumes with AI, matches candidates to jobs with precision, and generates personalized learning roadmaps to fill skill gaps.

- 🌐 **Live App:** [skillbridge-ai-web.vercel.app](https://skillbridge-ai-web.vercel.app/)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-5-purple) ![Axios](https://img.shields.io/badge/Axios-HTTP-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-4-black?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-Auth-black) |
| **AI Service** | ![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-Service-009688?logo=fastapi&logoColor=white) ![Neo4j](https://img.shields.io/badge/Neo4j-Graph-008CC1?logo=neo4j&logoColor=white) ![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector-F59E0B) ![Gemini](https://img.shields.io/badge/Gemini-LLM-4285F4?logo=google&logoColor=white) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=black) |

---

## 📚 Repositories

| Repo | Purpose |
|------|---------|
| [**Frontend**](https://github.com/Rahul-8283/skillbridge-ai-frontend) | React UI for job seekers & recruiters. Resume upload, job browsing, learning plans. |
| [**Backend**](https://github.com/Rahul-8283/skillbridge-ai-backend) | Node.js/Express API. Auth, data persistence, AI service orchestration. |
| [**AI Service**](https://github.com/djivites/skillbridge-ai-service) | Python FastAPI. Resume parsing, job matching, roadmap generation. |

---

## 🚀 Complete Setup Guide

### **Step 1: Clone All Repositories**

```bash
# Create project directory
mkdir skillbridge-project && cd skillbridge-project

# Clone all three repos
git clone https://github.com/Rahul-8283/skillbridge-ai-frontend.git
git clone https://github.com/Rahul-8283/skillbridge-ai-backend.git
git clone https://github.com/djivites/skillbridge-ai-service.git
```

---

### **Step 2: Environment Configuration**

#### **A) Frontend (`.env`)**
```bash
cd skillbridge-ai-frontend
cat > .env << 'EOF'
VITE_APP_MODE=development
VITE_BACKEND_URL_DEV=http://localhost:5000
VITE_BACKEND_URL_PROD=https://skillbridge-ai-web.vercel.app
VITE_APP_NAME=SkillBridge AI
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_RAG=true
VITE_ENABLE_SKILL_EXTRACTION=true
EOF
```

#### **B) Backend (`.env`)**
```bash
cd ../skillbridge-ai-backend
cat > .env << 'EOF'
PORT=5000
MODE_F=development
CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PRO=https://skillbridge-ai-web.vercel.app

# Database
MONGO_URI=mongodb://ur_mongo_url
REDIS_URL=redis://ur_redis_rul

# Security
JWT_SECRET=your_super_secret_jwt_key_change_me
JWT_EXPIRES_IN=7d

# AI Service
FASTAPI_URL=http://localhost:8000
EOF
```

#### **C) AI Service (`.env`)**
```bash
cd ../skillbridge-ai-service
cat > .env << 'EOF'
# LLM API Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password

# ChromaDB
CHROMA_DB_PATH=./chroma_data
EOF
```

---

### **Step 3: Start Services (3 Terminals)**

**Terminal 1: Backend**
```bash
cd skillbridge-ai-backend
npm install
npm run dev
# ✅ Runs on http://localhost:5000
```

**Terminal 2: AI Service**
```bash
cd skillbridge-ai-service
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# ✅ Runs on http://localhost:8000
```

**Terminal 3: Frontend**
```bash
cd skillbridge-ai-frontend
npm install
npm run dev
# ✅ Runs on http://localhost:5173
```

**Open browser:** [http://localhost:5173](http://localhost:5173)

---

## ✨ Key Features

### 🤖 **1. AI-Powered Resume Analysis**
- **Automatic Skill Extraction:** Parses PDF resumes and extracts technical skills, soft skills, certifications, and work experience.
- **Confidence Scoring:** Each extracted skill includes a confidence score to ensure accuracy.
- **Data Enrichment:** Normalizes and standardizes skill names against industry standards.
- **Experience Timeline:** Automatically extracts job titles, companies, durations, and responsibilities.
- **Education Mapping:** Identifies degrees, certifications, and educational institutions.

### 🎯 **2. Intelligent Job Matching**
- **Semantic Matching:** Goes beyond keyword matching using graph-based similarity algorithms.
- **Match Scoring:** Calculates compatibility percentages based on skill alignment (0-100%).
- **Missing Skills Highlight:** Identifies specific skills the candidate is missing for each job.
- **Extra Skills Recognition:** Highlights skills candidate has that exceed job requirements.
- **Real-time Updates:** Match scores update in real-time as new jobs are posted or skills are added.
- **Ranking Algorithm:** Sorts jobs by relevance and fit, prioritizing best matches.

### 📚 **3. Personalized Learning Roadmaps**
- **AI-Generated Plans:** Creates step-by-step learning sequences based on missing skills.
- **Prerequisite Mapping:** Understands skill dependencies using Neo4j knowledge graph.
- **Time Estimates:** Predicts hours needed for each module based on complexity.
- **Structured Modules:** Organizes learning into logical, digestible sections.
- **Progress Tracking:** Marks completed modules and tracks overall progress.
- **Adaptive Difficulty:** Suggests easier modules first, progressing to advanced topics.

### 🔗 **4. Curated Learning Resources**
- **YouTube Integration:** Automatically finds and links relevant tutorial videos.
- **GitHub Repositories:** Discovers practice projects and code examples from GitHub.
- **Documentation Links:** Aggregates official documentation for technologies and frameworks.
- **Diverse Formats:** Supports videos, articles, repositories, and interactive workshops.
- **Quality Filtering:** Prioritizes high-rated and trending resources.
- **Multiple Resources Per Skill:** Provides alternative learning paths when one resource doesn't work.

### 👥 **5. Dual User Roles**

#### **For Job Seekers:**
- Upload and manage multiple resumes
- Browse jobs with personalized match scores
- Track applications and view status updates
- Generate learning roadmaps for upskilling
- View detailed job requirements vs. current skills
- Access achievement milestones and badges

#### **For Recruiters (Providers):**
- Post job listings with required skills
- Browse candidates with match compatibility
- View seeker profiles and resumes
- Review incoming applications
- Filter candidates by match score and availability
- Track hiring pipeline and communication

### 📊 **6. End-to-End Application Tracking**
- **Application History:** Track all submitted applications with timestamps.
- **Status Updates:** Real-time status changes (pending, accepted, rejected).
- **Application Timeline:** Visual timeline showing application journey.
- **Communication Log:** Messages from recruiters visible in one place.
- **Candidate Notes:** Recruiters can add private notes during review.
- **Bulk Actions:** Mass update statuses for multiple applications.

### 🔐 **7. Role-Based Authentication & Security**
- **JWT Token-Based Auth:** Secure login with 7-day token expiration.
- **Password Hashing:** bcryptjs ensures passwords are never stored in plaintext.
- **Role-Based Access Control:** Seekers and providers have separate protected routes.
- **Protected APIs:** All endpoints require valid authentication tokens.
- **Session Management:** Auto-logout on token expiration with refresh capability.
- **CORS Protection:** Cross-origin requests restricted to authorized domains.

### 📱 **8. Responsive & User-Friendly Interface**
- **Mobile-First Design:** Works seamlessly on desktop, tablet, and mobile devices.
- **Dark Mode Ready:** TailwindCSS supports light/dark theme switching.
- **Smooth Animations:** Framer Motion provides polished transitions and interactions.
- **Accessible UI:** Semantic HTML and keyboard navigation support.
- **Real-time Notifications:** Toast alerts for successful actions and errors.
- **Intuitive Dashboards:** Clear stats, charts, and action cards on each dashboard.

### ⚡ **9. Performance Optimizations**
- **Redis Caching:** Job listings and frequently accessed data cached for speed.
- **Rate Limiting:** Prevent API abuse with intelligent rate limiting.
- **Code Splitting:** Lazy-loaded routes reduce initial bundle size.
- **Database Indexing:** Fast queries on MongoDB with optimized indexes.
- **CDN Ready:** Static assets optimized for CDN distribution.

### 🧠 **10. Knowledge Graph & AI Intelligence**
- **Skill Relationships:** Neo4j models how skills connect and depend on each other.
- **Prerequisite Chains:** Automatically suggests learning order based on dependencies.
- **Graph Queries:** Fast traversal to find related skills and career paths.
- **Semantic Understanding:** Recognizes skill variations (e.g., "JS" = "JavaScript").
- **Career Progression:** Suggests next roles based on current skills and market trends.

---

## 🏗️ System Architecture

### **Three-Tier Microservices Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│         (React + Vite on Vercel)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Login & Role Selection                            │   │
│  │  • Resume Upload & Analysis Display                  │   │
│  │  • Job Browsing with Match Scores                    │   │
│  │  • Learning Roadmap UI                               │   │
│  │  • Applications Tracking Dashboard                   │   │
│  │  • Provider Job Management                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓ (Axios)                           │
├─────────────────────────────────────────────────────────────┤
│                   API GATEWAY LAYER                         │
│      (Express.js + Node.js on Render)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes:                                             │   │
│  │  • /api/auth - Authentication, JWT tokens            │   │
│  │  • /api/user - User profiles, role mgmt              │   │
│  │  • /api/seeker - Resume, applications                │   │
│  │  • /api/provider - Job posting, candidates           │   │
│  │  • /api/jobs - Job CRUD, matching                    │   │
│  │  • /api/learning-plan - Roadmap operations           │   │
│  │                                                      │   │
│  │  Middleware:                                         │   │
│  │  • JWT verification & role-based access              │   │
│  │  • Rate limiting (Redis)                             │   │
│  │  • Error handling & logging                          │   │
│  │  • File upload (Multer)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                ↓ (HTTP Calls)         ↓ (MongoDB)           │
├─────────────────────────────────────────────────────────────┤
│          AI SERVICE LAYER          │    DATA LAYER          │
│    (FastAPI + Python)              │  (MongoDB, Redis)      │
│ ┌─────────────────────────────┐    │ ┌──────────────────┐   │
│ │  Resume Analyzer Agent      │    │ │  Collections:    │   │
│ │  • PDF parsing              │    │ │  • users         │   │
│ │  • Skill extraction         │    │ │  • resumes       │   │
│ │  • NLP processing           │    │ │  • jobs          │   │
│ │                             │    │ │  • applications  │   │
│ │  Job Matcher Agent          │    │ │  • learning      │   │
│ │  • Semantic similarity      │    │ │    plans         │   │
│ │  • Skill gap analysis       │    │ │  • profiles      │   │
│ │  • Score calculation        │    │ │                  │   │
│ │                             │    │ │  Redis Cache:    │   │
│ │  Roadmap Generator Agent    │    │ │  • Job listings  │   │
│ │  • Prerequisite mapping     │    │ │  • Rate limits   │   │
│ │  • Time estimation          │    │ │  • Sessions      │   │
│ │  • Resource ranking         │    │ │                  │   │
│ │                             │    │ │  Neo4j Graph:    │   │
│ │  ↓ (LLM Calls)  ↓ (Graph)   │    │ │  • Skills graph  │   │
│ └─────────────────────────────┘    │ │  • Prerequisites │   │
│     ↓         ↓                    │ │  • Relationships │   │
│  Gemini/   Neo4j          ChromaDB │ │                  │   │
│  Groq      (Knowledge)    (Vector) │ └──────────────────┘   │
│            Graph          Store    │                        │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow Pipelines**

#### **1. Resume Upload & Analysis Pipeline**
```
1. User uploads PDF in Frontend
   ↓
2. Backend stores file (Multer) & creates Resume doc
   ↓
3. Backend sends resume text to FastAPI
   ↓
4. AI Service:
   - Extraction Agent parses resume
   - NLP normalizes skill names
   - Knowledge Graph Agent enriches with relationships
   ↓
5. Backend stores analysis in MongoDB
   ↓
6. Frontend displays extracted skills with confidence scores
   ↓
7. Backend can now match against jobs in real-time
```

#### **2. Job Matching Pipeline**
```
1. User clicks "Browse Jobs"
   ↓
2. Frontend requests jobs with their resume ID
   ↓
3. Backend retrieves user skills from MongoDB
   ↓
4. Backend calls AI Service with user skills + all jobs
   ↓
5. AI Service Matching Agent:
   - Uses Neo4j for graph similarity
   - Compares skill graphs semantically
   - Calculates match percentages
   ↓
6. Returns ranked jobs with match scores
   ↓
7. Backend caches results in Redis
   ↓
8. Frontend displays jobs sorted by match score
```

#### **3. Learning Roadmap Generation Pipeline**
```
1. User requests roadmap for a job
   ↓
2. Backend extracts user skills + job requirements
   ↓
3. Backend sends to AI Service
   ↓
4. AI Service creates roadmap:
   - Extraction Agent identifies missing skills
   - Planning Agent orders by prerequisites
   - Retrieval Agent finds resources (RAG)
   - Time Estimation Agent calculates duration
   ↓
5. Backend stores roadmap in MongoDB
   ↓
6. Frontend displays structured modules with:
   - Learning steps
   - YouTube videos
   - GitHub projects
   - Documentation links
   - Time estimates
```

### **Service Communication**

| From | To | Method | Purpose |
|------|----|---------|---------
| Frontend | Backend | HTTPS REST | All user actions, data retrieval |
| Backend | AI Service | HTTP POST | Resume analysis, job matching, roadmap generation |
| Backend | MongoDB | Binary Protocol | CRUD operations on all data |
| Backend | Redis | Binary Protocol | Cache management & rate limiting |
| AI Service | Neo4j | Binary Protocol | Graph queries for skill relationships |
| AI Service | ChromaDB | HTTP API | Vector similarity for resource matching |
| AI Service | Gemini/Groq APIs | HTTP REST | LLM calls for AI generation |

### **Database Schema Highlights**

**User Collection:**
```javascript
{
  _id: ObjectId,
  email: String,
  password: Hash,
  role: "seeker" | "provider",
  profile: {
    name, experience, skills, education
  },
  createdAt: DateTime
}
```

**Resume Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref),
  fileUrl: String,
  analysis: {
    extractedSkills: [{ name, confidence }],
    experience: [{ company, title, duration }],
    certification: [{ name, issuer }],
    education: [{ degree, institution }]
  },
  uploadedAt: DateTime
}
```

**Job Collection:**
```javascript
{
  _id: ObjectId,
  providerId: ObjectId (ref),
  title: String,
  description: String,
  requiredSkills: [String],
  salary: { min, max },
  createdAt: DateTime
}
```

**LearningPlan Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref),
  jobId: ObjectId (ref),
  roadmapTitle: String,
  totalHours: Number,
  modules: [{
    moduleName: String,
    duration: Number,
    skills: [String],
    resources: {
      youtubeUrl: String,
      githubRepos: [String],
      documentation: [String]
    }
  }],
  createdAt: DateTime
}
```

### **Security Architecture**

- **Authentication:** JWT tokens (7-day expiration)
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** bcryptjs for password hashing
- **Rate Limiting:** Redis tracks API calls per IP/user
- **File Upload:** Multer with file type validation
- **CORS:** Backend restricted to frontend domain
- **API Keys:** Environment-stored for LLM & graph DB access

### **Scalability Considerations**

- **Horizontal Scaling:** Stateless backend allows load balancing
- **Caching Layer:** Redis reduces database queries by 60%+
- **Database Indexing:** MongoDB indexes on frequently queried fields
- **Lazy Loading:** Frontend code-splits routes for faster load times
- **Async Processing:** FastAPI tasks run asynchronously (no blocking)
- **CDN Ready:** Static assets cacheable on Vercel's Global CDN

---