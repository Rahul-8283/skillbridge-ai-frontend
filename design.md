# SkillBridge AI - System Design Document

## 1. System Architecture Overview

### 1.1 High-Level Architecture

SkillBridge AI follows a microservices architecture with event-driven communication, implementing an agentic system that dynamically discovers skills and generates personalized learning roadmaps.

**Core Architectural Principles:**
- **On-Demand Ingestion:** Skills are scraped only when missing from the knowledge graph
- **Agentic Workflow:** Autonomous agents handle time estimation, skill extraction, and plan generation
- **Hybrid Storage:** Graph database for relationships, RAG for unstructured content
- **Scalable Design:** Microservices with horizontal scaling capabilities

### 1.2 System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (React.js)    │◄──►│   (Express.js)  │◄──►│   (Auth0)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Resume       │ │ Job         │ │ Matching   │
        │ Service      │ │ Service     │ │ Service    │
        └──────────────┘ └─────────────┘ └────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Skill        │ │ Ingestion   │ │ Learning   │
        │ Extraction   │ │ Agent       │ │ Plan Gen   │
        └──────────────┘ └─────────────┘ └────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Skill Graph  │ │ RAG System  │ │ Progress   │
        │ (MongoDB)    │ │ (Chroma)    │ │ Tracker    │
        └──────────────┘ └─────────────┘ └────────────┘
```

## 2. Detailed Component Design

### 2.1 Frontend Layer (React.js)

**Components:**
- **Dashboard:** User overview with progress tracking and job matches
- **Resume Upload:** Drag-and-drop interface with progress indicators
- **Job Browser:** Filtered job listings with similarity scores
- **Learning Plan Viewer:** Interactive timeline with course recommendations
- **Profile Management:** User preferences and skill tracking

**Key Features:**
- Responsive design with mobile-first approach
- Real-time updates using WebSocket connections
- Progressive Web App (PWA) capabilities
- Accessibility compliance (WCAG 2.1 AA)

**State Management:**
```javascript
// Redux store structure
{
  user: { profile, preferences, progress },
  jobs: { listings, matches, filters },
  skills: { userSkills, gaps, recommendations },
  learningPlan: { current, completed, upcoming }
}
```

### 2.2 API Gateway & Authentication

**API Gateway (Express.js):**
- Request routing and load balancing
- Rate limiting and throttling
- Request/response transformation
- Logging and monitoring
- CORS handling

**Authentication Flow:**
```
User → Frontend → Auth0 → JWT Token → API Gateway → Microservices
```

**Security Measures:**
- JWT token validation
- Role-based access control (RBAC)
- API key management for external services
- Request sanitization and validation

### 2.3 Core Microservices

#### 2.3.1 Resume Processing Service

**Responsibilities:**
- Text extraction from PDF/DOC files
- Structured data conversion using LLM
- Skill identification and categorization
- Experience signal extraction

**Processing Pipeline:**
```
PDF/DOC → Text Extraction → LLM Processing → JSON Structure → Database Storage
```

**Data Model:**
```json
{
  "userId": "string",
  "resumeId": "string",
  "extractedData": {
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [
      {
        "role": "Software Developer",
        "company": "TechCorp",
        "duration": "2 years",
        "technologies": ["React", "MongoDB"]
      }
    ],
    "projects": [
      {
        "name": "E-commerce Platform",
        "technologies": ["React", "Express", "MongoDB"],
        "description": "Built full-stack application"
      }
    ],
    "education": [],
    "certifications": []
  },
  "processedAt": "timestamp"
}
```

#### 2.3.2 Job Management Service

**Responsibilities:**
- Job posting CRUD operations
- Integration with external job portals
- Skill requirement extraction
- Job categorization and tagging

**External Integrations:**
- LinkedIn Jobs API
- Indeed API
- Custom web scraping (respecting robots.txt)

**Job Data Model:**
```json
{
  "jobId": "string",
  "title": "Senior React Developer",
  "company": "TechCorp",
  "description": "string",
  "requiredSkills": ["React", "TypeScript", "GraphQL"],
  "preferredSkills": ["AWS", "Docker"],
  "experience": "3-5 years",
  "location": "Remote",
  "salary": "80000-120000",
  "postedAt": "timestamp",
  "source": "linkedin"
}
```

#### 2.3.3 Skill Extraction Agent

**Core Algorithm:**
```python
def extract_skills(text, context="resume"):
    # LLM-based skill extraction
    prompt = f"""
    Extract technical and soft skills from the following {context}:
    {text}
    
    Return skills in categories:
    - Programming Languages
    - Frameworks/Libraries  
    - Tools/Technologies
    - Soft Skills
    - Domain Knowledge
    """
    
    skills = llm.generate(prompt)
    return normalize_skills(skills)
```

**Skill Normalization:**
- Synonym resolution (React.js → React)
- Skill hierarchy mapping (React → Frontend Development)
- Confidence scoring for extracted skills

#### 2.3.4 On-Demand Ingestion Agent

**Trigger Conditions:**
```python
def should_ingest_skill(skill_name):
    return not skill_graph.exists(skill_name)
```

**Ingestion Sources:**
- **Coursera API:** Course metadata, duration, modules
- **Udemy API:** Course information, ratings, content outline
- **edX API:** University course data, prerequisites
- **Documentation Scraping:** Official docs table of contents
- **GitHub API:** Repository analysis for skill complexity

**Metadata Collection:**
```json
{
  "skillName": "Docker",
  "sources": [
    {
      "platform": "Coursera",
      "courses": [
        {
          "title": "Docker Essentials",
          "duration": "15 hours",
          "modules": 8,
          "level": "Beginner",
          "lastUpdated": "2024-01-15"
        }
      ]
    }
  ],
  "estimatedLearningTime": "20 hours",
  "difficulty": "Intermediate",
  "prerequisites": ["Linux Basics", "Command Line"]
}
```

#### 2.3.5 Time Estimation Agent

**Estimation Algorithm:**
```python
class TimeEstimationAgent:
    def estimate_learning_time(self, skill, user_background):
        # Collect data from multiple sources
        course_data = self.get_course_metadata(skill)
        complexity_score = self.analyze_skill_complexity(skill)
        user_experience = self.assess_user_background(user_background)
        
        # Normalize time estimates
        base_time = self.normalize_course_durations(course_data)
        
        # Apply complexity and experience adjustments
        adjusted_time = base_time * complexity_score * user_experience
        
        return {
            "estimated_hours": adjusted_time,
            "confidence": self.calculate_confidence(),
            "sources": course_data
        }
```

**Time Normalization Examples:**
- "4 weeks × 5 hrs/week" → 20 hours
- "Self-paced, 10-15 hours" → 12.5 hours
- "3 months part-time" → 60 hours (assuming 5 hrs/week)

### 2.4 Data Storage Layer

#### 2.4.1 Skill Knowledge Graph (MongoDB)

**Graph Structure:**
```javascript
// Skill Node
{
  _id: ObjectId,
  name: "React",
  category: "Frontend Framework",
  estimatedTime: 25, // hours
  difficulty: "Intermediate",
  prerequisites: ["JavaScript", "HTML", "CSS"],
  relatedSkills: ["Redux", "Next.js", "TypeScript"],
  lastUpdated: Date,
  sources: ["coursera", "udemy", "official-docs"]
}

// Skill Relationship
{
  _id: ObjectId,
  fromSkill: "JavaScript",
  toSkill: "React",
  relationshipType: "prerequisite",
  strength: 0.9 // 0-1 scale
}
```

**Graph Operations:**
- Skill dependency traversal
- Learning path generation
- Skill similarity calculation
- Gap analysis queries

#### 2.4.2 RAG System (Chroma Vector Database)

**Document Types:**
- Course descriptions and syllabi
- Job posting full text
- Documentation excerpts
- Learning resource metadata

**Embedding Strategy:**
```python
# Use sentence-transformers for semantic embeddings
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def create_embeddings(documents):
    embeddings = model.encode(documents)
    return embeddings
```

**Retrieval Process:**
```python
def retrieve_learning_resources(skill, user_level):
    query = f"Learn {skill} for {user_level} level"
    query_embedding = model.encode([query])
    
    results = chroma_client.query(
        query_embeddings=query_embedding,
        n_results=10,
        where={"skill": skill, "level": user_level}
    )
    
    return rank_by_relevance(results)
```

### 2.5 Matching & Recommendation Engine

#### 2.5.1 Job-Candidate Matching Algorithm

**Similarity Calculation:**
```python
def calculate_job_match(user_skills, job_requirements):
    # Convert skills to embeddings
    user_embedding = skill_to_embedding(user_skills)
    job_embedding = skill_to_embedding(job_requirements)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(user_embedding, job_embedding)
    
    # Apply skill importance weights
    weighted_score = apply_skill_weights(similarity, job_requirements)
    
    # Minimum threshold check
    if weighted_score < 0.5:
        return None  # Filter out low matches
    
    return {
        "score": weighted_score,
        "matching_skills": get_matching_skills(user_skills, job_requirements),
        "missing_skills": get_missing_skills(user_skills, job_requirements)
    }
```

**Skill Gap Analysis:**
```python
def analyze_skill_gaps(user_skills, target_job):
    missing_skills = set(target_job.required_skills) - set(user_skills)
    
    # Expand with prerequisites
    expanded_gaps = []
    for skill in missing_skills:
        prerequisites = skill_graph.get_prerequisites(skill)
        user_has_prereqs = all(prereq in user_skills for prereq in prerequisites)
        
        expanded_gaps.append({
            "skill": skill,
            "prerequisites_met": user_has_prereqs,
            "estimated_time": skill_graph.get_learning_time(skill),
            "difficulty": skill_graph.get_difficulty(skill)
        })
    
    return expanded_gaps
```

#### 2.5.2 Learning Plan Generation

**Plan Generation Algorithm:**
```python
class LearningPlanGenerator:
    def generate_plan(self, skill_gaps, user_constraints):
        # Sort skills by dependency order
        ordered_skills = self.topological_sort(skill_gaps)
        
        # Apply time constraints
        feasible_skills = self.filter_by_time_constraint(
            ordered_skills, 
            user_constraints.hours_per_week,
            user_constraints.target_date
        )
        
        # Generate weekly schedule
        weekly_plan = self.create_weekly_schedule(
            feasible_skills,
            user_constraints.hours_per_week
        )
        
        # Add learning resources
        enriched_plan = self.add_learning_resources(weekly_plan)
        
        return enriched_plan
```

**Plan Structure:**
```json
{
  "planId": "string",
  "userId": "string",
  "targetJob": "jobId",
  "totalDuration": "12 weeks",
  "hoursPerWeek": 10,
  "schedule": [
    {
      "week": 1,
      "skills": ["JavaScript Fundamentals"],
      "resources": [
        {
          "type": "course",
          "title": "JavaScript Essentials",
          "platform": "Coursera",
          "duration": "8 hours",
          "url": "https://..."
        }
      ],
      "projects": [
        {
          "title": "Build a Calculator",
          "description": "Practice JS fundamentals",
          "estimatedTime": "2 hours"
        }
      ]
    }
  ],
  "milestones": [
    {
      "week": 4,
      "achievement": "Complete JavaScript Fundamentals",
      "assessment": "Build a simple web application"
    }
  ]
}
```

### 2.6 Progress Tracking & Adaptation

#### 2.6.1 Progress Monitoring

**Progress Data Model:**
```json
{
  "userId": "string",
  "planId": "string",
  "currentWeek": 3,
  "completedSkills": ["JavaScript", "HTML", "CSS"],
  "inProgressSkills": ["React"],
  "timeSpent": {
    "JavaScript": 15,
    "HTML": 8,
    "CSS": 12,
    "React": 5
  },
  "assessmentScores": {
    "JavaScript": 85,
    "HTML": 92,
    "CSS": 78
  },
  "lastUpdated": "timestamp"
}
```

#### 2.6.2 Adaptive Replanning

**Replanning Triggers:**
```python
def should_replan(user_progress, original_plan):
    triggers = []
    
    # Behind schedule
    if user_progress.current_week > original_plan.expected_week:
        triggers.append("behind_schedule")
    
    # Skill mastery faster than expected
    if user_progress.avg_assessment_score > 90:
        triggers.append("accelerated_learning")
    
    # New skills added to resume
    if user_progress.new_skills_added:
        triggers.append("skill_update")
    
    # Time availability changed
    if user_progress.hours_per_week != original_plan.hours_per_week:
        triggers.append("time_constraint_change")
    
    return len(triggers) > 0, triggers
```

## 3. API Design

### 3.1 RESTful API Endpoints

#### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
```

#### Resume Management
```
POST /api/resumes/upload
GET  /api/resumes/{userId}
PUT  /api/resumes/{resumeId}
DELETE /api/resumes/{resumeId}
GET  /api/resumes/{resumeId}/skills
```

#### Job Management
```
GET  /api/jobs
POST /api/jobs
GET  /api/jobs/{jobId}
PUT  /api/jobs/{jobId}
DELETE /api/jobs/{jobId}
GET  /api/jobs/search?skills=react,node&location=remote
```

#### Matching & Recommendations
```
GET  /api/matches/{userId}
GET  /api/matches/{userId}/jobs/{jobId}
POST /api/recommendations/learning-plan
GET  /api/recommendations/resources?skill=react&level=beginner
```

#### Progress Tracking
```
GET  /api/progress/{userId}
POST /api/progress/{userId}/update
GET  /api/progress/{userId}/plan/{planId}
PUT  /api/progress/{userId}/plan/{planId}
```

### 3.2 WebSocket Events

**Real-time Updates:**
```javascript
// Client-side event handling
socket.on('resume_processed', (data) => {
  updateSkillsDisplay(data.extractedSkills);
});

socket.on('job_matches_updated', (data) => {
  refreshJobMatches(data.matches);
});

socket.on('learning_progress_updated', (data) => {
  updateProgressBar(data.progress);
});
```

## 4. Security Design

### 4.1 Authentication & Authorization

**OAuth 2.0 Flow with Auth0:**
```
1. User initiates login
2. Redirect to Auth0 authorization server
3. User authenticates with Auth0
4. Auth0 returns authorization code
5. Exchange code for JWT access token
6. Include JWT in API requests
7. API Gateway validates JWT
8. Forward request to microservices
```

**Role-Based Access Control:**
```json
{
  "roles": {
    "job_seeker": {
      "permissions": ["read:own_profile", "update:own_profile", "read:jobs", "create:learning_plan"]
    },
    "recruiter": {
      "permissions": ["read:candidates", "create:jobs", "update:own_jobs", "read:analytics"]
    },
    "admin": {
      "permissions": ["*"]
    }
  }
}
```

### 4.2 Data Protection

**Encryption:**
- Data at rest: AES-256 encryption
- Data in transit: TLS 1.3
- Database connections: SSL/TLS
- API communications: HTTPS only

**Privacy Measures:**
- PII tokenization for sensitive data
- Data anonymization for analytics
- GDPR compliance with right to deletion
- Audit logging for data access

### 4.3 API Security

**Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

**Input Validation:**
```javascript
const { body, validationResult } = require('express-validator');

const validateResumeUpload = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Resume file is required');
    }
    if (!['application/pdf', 'application/msword'].includes(req.file.mimetype)) {
      throw new Error('Only PDF and DOC files are allowed');
    }
    return true;
  })
];
```

## 5. Performance & Scalability

### 5.1 Caching Strategy

**Multi-Level Caching:**
```
Browser Cache → CDN → API Gateway Cache → Redis → Database
```

**Cache Implementation:**
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache skill graph queries
async function getSkillWithCache(skillName) {
  const cacheKey = `skill:${skillName}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const skill = await skillGraph.findSkill(skillName);
  await client.setex(cacheKey, 3600, JSON.stringify(skill)); // 1 hour TTL
  
  return skill;
}
```

### 5.2 Database Optimization

**MongoDB Indexing:**
```javascript
// Skill collection indexes
db.skills.createIndex({ "name": 1 }, { unique: true });
db.skills.createIndex({ "category": 1, "difficulty": 1 });
db.skills.createIndex({ "prerequisites": 1 });

// Job collection indexes
db.jobs.createIndex({ "requiredSkills": 1 });
db.jobs.createIndex({ "location": 1, "postedAt": -1 });
db.jobs.createIndex({ "company": 1, "title": "text" });
```

**Query Optimization:**
```javascript
// Efficient skill gap analysis
const pipeline = [
  { $match: { userId: userId } },
  { $lookup: {
      from: "skills",
      localField: "skills",
      foreignField: "name",
      as: "skillDetails"
  }},
  { $project: {
      missingSkills: {
        $setDifference: ["$targetJob.requiredSkills", "$skills"]
      }
  }}
];
```

### 5.3 Microservices Scaling

**Horizontal Scaling Configuration:**
```yaml
# Docker Compose scaling
version: '3.8'
services:
  resume-service:
    image: skillbridge/resume-service
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    
  job-service:
    image: skillbridge/job-service
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.3'
          memory: 256M
```

**Load Balancing:**
```javascript
// API Gateway load balancing
const services = {
  'resume-service': ['http://resume-1:3001', 'http://resume-2:3001', 'http://resume-3:3001'],
  'job-service': ['http://job-1:3002', 'http://job-2:3002']
};

function getServiceEndpoint(serviceName) {
  const endpoints = services[serviceName];
  return endpoints[Math.floor(Math.random() * endpoints.length)];
}
```

## 6. Monitoring & Observability

### 6.1 Logging Strategy

**Structured Logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log' }),
    new winston.transports.Console()
  ]
});

// Usage
logger.info('Skill extraction completed', {
  userId: userId,
  skillsFound: skills.length,
  processingTime: endTime - startTime
});
```

### 6.2 Metrics & Alerting

**Key Metrics:**
- Resume processing time and success rate
- Skill extraction accuracy
- Job matching precision/recall
- Learning plan completion rates
- API response times and error rates
- Database query performance

**Alerting Rules:**
```yaml
# Prometheus alerting rules
groups:
- name: skillbridge.rules
  rules:
  - alert: HighResumeProcessingTime
    expr: avg(resume_processing_duration_seconds) > 30
    for: 5m
    annotations:
      summary: "Resume processing taking too long"
  
  - alert: LowSkillExtractionAccuracy
    expr: skill_extraction_accuracy < 0.85
    for: 10m
    annotations:
      summary: "Skill extraction accuracy below threshold"
```

### 6.3 Health Checks

**Service Health Endpoints:**
```javascript
// Health check implementation
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      external_apis: await checkExternalAPIs()
    }
  };
  
  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

## 7. Deployment Architecture

### 7.1 Container Orchestration

**Kubernetes Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skillbridge-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: skillbridge-api
  template:
    metadata:
      labels:
        app: skillbridge-api
    spec:
      containers:
      - name: api
        image: skillbridge/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: uri
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 7.2 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: Deploy SkillBridge AI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run tests
      run: |
        npm install
        npm test
        npm run test:integration

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Build Docker images
      run: |
        docker build -t skillbridge/api .
        docker push skillbridge/api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/skillbridge-api api=skillbridge/api:${{ github.sha }}
        kubectl rollout status deployment/skillbridge-api
```

## 8. Future Enhancements

### 8.1 Advanced AI Features

**Skill Trend Analysis:**
- Market demand prediction for skills
- Emerging technology identification
- Career path optimization

**Personalized Learning:**
- Learning style adaptation
- Difficulty adjustment based on progress
- Multi-modal content recommendations

### 8.2 Integration Expansions

**Additional Data Sources:**
- GitHub profile analysis
- Stack Overflow activity
- Professional certification databases
- Industry-specific skill frameworks

**Enhanced Job Matching:**
- Salary prediction models
- Company culture fit analysis
- Remote work compatibility scoring

### 8.3 Mobile Application

**Native Mobile Features:**
- Offline learning plan access
- Push notifications for milestones
- Camera-based resume scanning
- Voice-activated progress updates

This design document provides a comprehensive blueprint for implementing SkillBridge AI as a scalable, intelligent system that bridges the gap between current skills and job requirements through dynamic skill discovery and personalized learning recommendations.