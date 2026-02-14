# SkillBridge AI - Requirements Document

## Project Overview

**Project Title:** SkillBridge AI – Agentic Resume-to-Job Readiness System

**Vision:** An intelligent system that dynamically discovers skills from resumes and job postings, performs on-demand skill ingestion, and generates personalized learning roadmaps to bridge the gap between current capabilities and job requirements.

## 1. Functional Requirements

### 1.1 User Management & Authentication
- **FR-1.1:** System shall support user registration and authentication via Auth0
- **FR-1.2:** System shall support role-based access (Job Seekers, Job Providers/Recruiters)
- **FR-1.3:** System shall maintain user profiles with preferences and learning history

### 1.2 Resume Processing
- **FR-2.1:** System shall accept resume uploads in PDF and DOC formats
- **FR-2.2:** System shall extract text content from uploaded resumes
- **FR-2.3:** System shall convert unstructured resume text into structured JSON format
- **FR-2.4:** System shall identify and extract skills, projects, tools, and experience signals
- **FR-2.5:** System shall store structured resume data in database (raw files discarded post-processing)

### 1.3 Job Posting Management
- **FR-3.1:** System shall allow recruiters to post job descriptions manually
- **FR-3.2:** System shall integrate with job portals (LinkedIn, Indeed) for automated job ingestion
- **FR-3.3:** System shall store job descriptions in vector database (RAG) for semantic search
- **FR-3.4:** System shall extract skill requirements from job postings using LLM

### 1.4 Dynamic Skill Discovery
- **FR-4.1:** System shall extract skill concepts from both resume text and job descriptions
- **FR-4.2:** System shall identify implicit skills (e.g., "Fine-tuned LLaMA using LoRA" → LLM Fine-tuning, LoRA, Transformers)
- **FR-4.3:** System shall check if extracted skills exist in the Skill Graph
- **FR-4.4:** System shall trigger on-demand ingestion only for missing skills

### 1.5 On-Demand Data Ingestion
- **FR-5.1:** System shall perform targeted metadata extraction from public sources (Coursera, Udemy, edX, university syllabi, official documentation)
- **FR-5.2:** System shall collect course duration, module count, skill level, topic order, and last updated date
- **FR-5.3:** System shall store raw evidence (course descriptions, syllabi) in RAG system
- **FR-5.4:** System shall NOT scrape videos, paid content, or certificates

### 1.6 Time & Difficulty Estimation
- **FR-6.1:** System shall implement autonomous Time Estimation Agent
- **FR-6.2:** Agent shall normalize time estimates from multiple sources
- **FR-6.3:** Agent shall cross-check estimates with skill complexity
- **FR-6.4:** System shall store estimated learning time and difficulty in Skill Graph

### 1.7 Skill Graph Management
- **FR-7.1:** System shall maintain a knowledge graph of skills with dependencies
- **FR-7.2:** System shall store skill nodes with name, estimated time, difficulty, and prerequisites
- **FR-7.3:** System shall support skill relationship mapping (prerequisites, related skills)
- **FR-7.4:** System shall enable graph traversal for learning path generation

### 1.8 Matching & Feasibility Analysis
- **FR-8.1:** System shall compare resume skill subgraph with job skill subgraph
- **FR-8.2:** System shall calculate match scores between candidates and jobs
- **FR-8.3:** System shall only consider jobs with ≥50% skill match
- **FR-8.4:** System shall identify skill gaps (Missing Skills = Job Skills - Resume Skills)
- **FR-8.5:** System shall perform time feasibility checks based on user availability

### 1.9 Learning Plan Generation
- **FR-9.1:** System shall retrieve best learning resources from RAG based on skill coverage, practical depth, recency, and level match
- **FR-9.2:** System shall generate personalized learning plans with weekly schedules
- **FR-9.3:** System shall provide skill order, recommended courses, mini-projects, and deadlines
- **FR-9.4:** System shall include explainability layer showing reasoning for recommendations

### 1.10 Progress Monitoring & Adaptation
- **FR-10.1:** System shall monitor user progress through learning plans
- **FR-10.2:** System shall trigger replanning when resume is updated, skills are completed, or time availability changes
- **FR-10.3:** System shall continuously update skill graph and matching results
- **FR-10.4:** System shall provide progress dashboards and analytics

## 2. Non-Functional Requirements

### 2.1 Performance Requirements
- **NFR-2.1:** Resume processing shall complete within 30 seconds
- **NFR-2.2:** Skill matching shall complete within 10 seconds for up to 1000 jobs
- **NFR-2.3:** System shall support concurrent processing of 100 resume uploads
- **NFR-2.4:** Learning plan generation shall complete within 60 seconds

### 2.2 Scalability Requirements
- **NFR-2.5:** System shall scale to support 1 million user profiles
- **NFR-2.6:** Skill graph shall support up to 100,000 skill nodes
- **NFR-2.7:** RAG system shall handle 10 million document embeddings
- **NFR-2.8:** System shall support horizontal scaling of microservices

### 2.3 Reliability Requirements
- **NFR-2.9:** System shall maintain 99.5% uptime
- **NFR-2.10:** Data backup shall occur every 24 hours
- **NFR-2.11:** System shall recover from failures within 15 minutes
- **NFR-2.12:** All user data shall be encrypted at rest and in transit

### 2.4 Security Requirements
- **NFR-2.13:** Authentication shall use OAuth 2.0 with Auth0
- **NFR-2.14:** API endpoints shall implement rate limiting
- **NFR-2.15:** Sensitive data shall be encrypted using AES-256
- **NFR-2.16:** System shall comply with GDPR and data privacy regulations

### 2.5 Usability Requirements
- **NFR-2.17:** User interface shall be responsive and mobile-friendly
- **NFR-2.18:** System shall provide intuitive navigation and clear feedback
- **NFR-2.19:** Learning plans shall be exportable in PDF format
- **NFR-2.20:** System shall support multiple languages (English, Spanish, French)

## 3. Technical Constraints

### 3.1 Technology Stack
- **TC-3.1:** Frontend shall use React.js with modern JavaScript (ES6+)
- **TC-3.2:** Backend shall use Node.js with Express.js framework
- **TC-3.3:** Database shall use MongoDB for document storage
- **TC-3.4:** Vector database shall use Chroma for RAG implementation
- **TC-3.5:** Authentication shall integrate with Auth0

### 3.2 Integration Requirements
- **TC-3.6:** System shall integrate with job portals via REST APIs
- **TC-3.7:** System shall use LLM APIs (OpenAI GPT-4 or equivalent) for text processing
- **TC-3.8:** System shall implement web scraping with respect to robots.txt and rate limits
- **TC-3.9:** System shall provide RESTful APIs for all core functionalities

### 3.3 Data Requirements
- **TC-3.10:** System shall maintain data consistency across distributed components
- **TC-3.11:** Skill graph shall be stored in graph database format
- **TC-3.12:** RAG embeddings shall use sentence transformers for semantic similarity
- **TC-3.13:** All timestamps shall use UTC format

## 4. Business Rules

### 4.1 Skill Discovery Rules
- **BR-4.1:** Skills are discovered dynamically, not from predefined lists
- **BR-4.2:** On-demand ingestion occurs only when skills are missing from the graph
- **BR-4.3:** Public metadata only - no scraping of paid or copyrighted content

### 4.2 Matching Rules
- **BR-4.4:** Jobs with <50% skill match are filtered out
- **BR-4.5:** Time feasibility must be realistic based on user availability
- **BR-4.6:** Prerequisites must be satisfied before advanced skills

### 4.3 Learning Plan Rules
- **BR-4.7:** Learning plans must include practical projects and hands-on experience
- **BR-4.8:** Course recommendations prioritize skill coverage over ratings
- **BR-4.9:** Plans must be achievable within user-specified timeframes

## 5. User Stories

### 5.1 Job Seeker Stories
- **US-5.1:** As a job seeker, I want to upload my resume so that the system can analyze my skills
- **US-5.2:** As a job seeker, I want to see job matches based on my current skills
- **US-5.3:** As a job seeker, I want to receive a personalized learning plan to qualify for target jobs
- **US-5.4:** As a job seeker, I want to track my learning progress and update my profile

### 5.2 Recruiter Stories
- **US-5.5:** As a recruiter, I want to post job descriptions so that qualified candidates can be matched
- **US-5.6:** As a recruiter, I want to see candidate similarity scores based on job requirements
- **US-5.7:** As a recruiter, I want to understand skill gaps in the candidate pool

### 5.3 System Administrator Stories
- **US-5.8:** As an admin, I want to monitor system performance and skill graph growth
- **US-5.9:** As an admin, I want to manage data ingestion sources and quality
- **US-5.10:** As an admin, I want to configure matching algorithms and thresholds

## 6. Acceptance Criteria

### 6.1 Core Functionality
- Resume upload and skill extraction accuracy >90%
- Job matching precision >80% for relevant positions
- Learning plan completion rate >70% for engaged users
- System response time <5 seconds for all user interactions

### 6.2 Data Quality
- Skill graph coverage >95% for technology and business skills
- Time estimation accuracy within ±20% of actual learning time
- Resource recommendation relevance score >85%

### 6.3 User Experience
- User onboarding completion rate >80%
- User satisfaction score >4.0/5.0
- Mobile responsiveness across all major devices
- Accessibility compliance with WCAG 2.1 AA standards

## 7. Assumptions and Dependencies

### 7.1 Assumptions
- Users will provide accurate information in their resumes
- Job descriptions contain sufficient skill information for extraction
- Public learning resources remain accessible for metadata extraction
- Users have basic digital literacy for platform navigation

### 7.2 Dependencies
- Auth0 service availability for authentication
- LLM API availability and rate limits
- Job portal API access and terms of service
- Third-party learning platform data accessibility
- Cloud infrastructure reliability (AWS/Azure/GCP)

## 8. Success Metrics

### 8.1 User Engagement
- Monthly active users growth rate
- Average session duration
- Feature adoption rates
- User retention rate (30, 60, 90 days)

### 8.2 System Performance
- Skill discovery accuracy
- Matching algorithm precision and recall
- Learning plan effectiveness (job placement rate)
- System uptime and response times

### 8.3 Business Impact
- Job placement success rate for users following learning plans
- Recruiter satisfaction with candidate quality
- Platform growth and market penetration
- Revenue generation (if applicable)