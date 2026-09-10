# InterviewIQ-Agentic-AI-Interview-Trainer
An Agentic AI Interview Trainer built using IBM Granite, watsonx.ai, watsonx Orchestrate, RAG, and IBM Cloud.
# InterviewIQ — Agentic AI Interview Trainer

> An AI-powered, personalized and adaptive interview preparation platform built using IBM Granite, watsonx.ai, watsonx Orchestrate, RAG, IBM Cloud, and Next.js.

InterviewIQ is an Agentic AI Interview Trainer designed to move beyond generic interview-question chatbots.

Instead of providing a static list of questions, InterviewIQ analyzes a candidate's profile, target role, and job requirements to create a personalized interview experience. It can generate role-specific questions, conduct an adaptive interview, evaluate candidate responses, identify strengths and skill gaps, and provide actionable improvement guidance.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Key Objectives](#key-objectives)
- [How InterviewIQ Works](#how-interviewiq-works)
- [Core Features](#core-features)
- [Agentic AI Workflow](#agentic-ai-workflow)
- [RAG Knowledge Base](#rag-knowledge-base)
- [IBM Technologies Used](#ibm-technologies-used)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Granite Integration](#granite-integration)
- [watsonx Orchestrate Integration](#watsonx-orchestrate-integration)
- [Candidate Profiling](#candidate-profiling)
- [Job Analysis and Skill Gap Analysis](#job-analysis-and-skill-gap-analysis)
- [Adaptive Interviewing](#adaptive-interviewing)
- [Answer Evaluation](#answer-evaluation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [IBM Cloud Configuration](#ibm-cloud-configuration)
- [Security](#security)
- [Testing and Validation](#testing-and-validation)
- [Project Documentation](#project-documentation)
- [Submission Files](#submission-files)
- [Screenshots and Demo](#screenshots-and-demo)
- [Current Status](#current-status)
- [Limitations](#limitations)
- [Future Scope](#future-scope)
- [Why InterviewIQ is Different](#why-interviewiq-is-different)
- [Learning Outcomes](#learning-outcomes)
- [Contributing](#contributing)
- [License](#license)

---

# Overview

InterviewIQ is an Agentic AI-powered interview training platform that provides personalized interview preparation based on:

- Candidate resume/profile
- Target job role
- Job description
- Candidate skills and experience
- Interview context
- Previous answers during the session

The platform combines Large Language Models, Retrieval-Augmented Generation, and Agentic AI to create a dynamic interview preparation experience.

The system is designed around the following principle:

> **The interview should adapt to the candidate, rather than forcing every candidate through the same fixed set of questions.**

InterviewIQ therefore attempts to understand the candidate first, analyze the target role, retrieve relevant interview knowledge, and then dynamically conduct and evaluate the interview.

---

# Problem Statement

Traditional interview preparation platforms often provide:

- Generic question banks
- Static preparation material
- Limited personalization
- Repetitive questions
- Little connection between the candidate's resume and the target role
- Limited understanding of job-specific requirements
- Basic or missing feedback
- No adaptive interview flow
- No structured improvement roadmap

A candidate preparing for an AI Engineer role, for example, should not receive exactly the same interview experience as someone preparing for a Software Engineer, Data Scientist, or Machine Learning Engineer role.

The challenge is therefore to build an intelligent interview trainer capable of understanding the candidate and the target opportunity before conducting the interview.

---

# Proposed Solution

InterviewIQ solves this problem using an Agentic AI architecture.

The system combines:

1. Candidate profiling
2. Job description analysis
3. Candidate-job skill matching
4. Personalized preparation
5. Retrieval-Augmented Generation
6. Agentic interview orchestration
7. Adaptive question selection
8. Answer evaluation
9. Performance analysis
10. Personalized improvement guidance

The application uses IBM Granite for language understanding and analysis and IBM watsonx Orchestrate for the agentic interview workflow and knowledge-grounded interactions.

---

# Key Objectives

The primary objectives of InterviewIQ are:

### 1. Personalized Interview Preparation

Analyze the candidate's profile and prepare questions relevant to their actual background.

### 2. Role-Specific Preparation

Adapt preparation according to the candidate's target role.

### 3. Job-Aware Preparation

Use the provided job description to identify important requirements and align interview preparation with them.

### 4. Knowledge-Grounded Responses

Use a curated interview knowledge base through RAG to ground questions, evaluation criteria, and interview guidance.

### 5. Adaptive Interviewing

Change the interview direction based on the candidate's previous answers.

### 6. Evidence-Based Evaluation

Evaluate answers using structured criteria rather than judging a candidate from a single response.

### 7. Actionable Feedback

Identify strengths, weaknesses, and areas requiring improvement.

---

# How InterviewIQ Works

The overall workflow is:

```text
Candidate
   |
   v
Resume Upload
   |
   v
Candidate Profile Extraction
   |
   v
Target Role + Job Description
   |
   v
Job Requirement Analysis
   |
   v
Candidate ↔ Job Skill Matching
   |
   v
Personalized Interview Preparation
   |
   v
RAG Knowledge Retrieval
   |
   v
Agentic Interview
   |
   +----> Adaptive Question Selection
   |
   +----> Candidate Answer
   |
   +----> Answer Evaluation
   |
   +----> Follow-up / Next Question
   |
   v
Performance Analysis
   |
   v
Improvement Roadmap
Core Features
1. Resume-Based Candidate Profiling

The candidate can provide a resume which is analyzed to extract relevant information such as:

Candidate name
Education
Experience
Projects
Skills
Technologies
Certifications
Achievements
Relevant strengths

The extracted information becomes the foundation for personalized interview preparation.

2. Target Role Selection

The candidate provides the role they are preparing for.

Examples:

AI Engineer
Machine Learning Engineer
Software Engineer
Data Scientist

The target role is used to determine the relevant interview domains and question types.

3. Job Description Analysis

If a job description is provided, InterviewIQ analyzes it to identify:

Required skills
Technical expectations
Relevant technologies
Role responsibilities
Experience expectations
Important competencies

This allows the system to align preparation with the actual opportunity.

4. Skill Gap Analysis

InterviewIQ compares:

Candidate Profile
        +
Job Requirements
        |
        v
Skill Matching
        |
        v
Strengths + Gaps + Priority Areas

This helps identify areas where the candidate is already strong and areas where additional preparation may be beneficial.

5. Personalized Interview Questions

Questions are generated according to:

Target role
Candidate skills
Candidate projects
Candidate experience
Job requirements
Technical domains
Behavioral competencies
Interview difficulty

This prevents InterviewIQ from behaving like a static question generator.

6. Adaptive Interview

InterviewIQ can adapt the next question based on the candidate's previous response.

For example:

Candidate Answer
       |
       v
Evaluation
       |
       +---- Strong Answer
       |        |
       |        v
       |   Increase Difficulty
       |
       +---- Weak Answer
       |        |
       |        v
       |   Clarify / Probe / Reinforce
       |
       +---- Partial Answer
                |
                v
           Follow-up Question

The objective is to make the interview dynamic and context-aware.

7. Technical Interview Assessment

The platform can cover technical areas relevant to roles such as:

Python
Machine Learning
Deep Learning
Generative AI
Large Language Models
RAG
NLP
SQL
APIs
Backend concepts
Cloud and deployment
Model evaluation
Feature engineering
8. Behavioral Interview Assessment

InterviewIQ can generate and evaluate behavioral questions around areas such as:

Communication
Teamwork
Conflict resolution
Leadership
Problem solving
Adaptability
Ownership
Learning ability
9. HR Interview Preparation

The system can also support common HR interview areas such as:

Career motivation
Strengths and weaknesses
Career goals
Role expectations
Professional behavior
Situational questions
10. Answer Evaluation

Candidate responses can be evaluated using structured criteria such as:

Relevance
Technical correctness
Completeness
Clarity
Reasoning
Communication
Evidence/examples
Depth of understanding

The objective is not simply to label an answer as "good" or "bad".

Instead, InterviewIQ provides actionable feedback explaining what was done well and what can be improved.

Agentic AI Workflow

Agentic AI is one of the core components of InterviewIQ.

Instead of implementing the application as a simple question-answer chatbot, the system uses an agent to manage the interview workflow.

The agent can reason about the current interview context and determine the appropriate next action.

The workflow includes:

Candidate Context
       |
       v
Role Context
       |
       v
Job Context
       |
       v
Knowledge Retrieval
       |
       v
Question Generation
       |
       v
Candidate Response
       |
       v
Response Evaluation
       |
       v
Next Action
       |
       +---- Ask follow-up
       |
       +---- Increase difficulty
       |
       +---- Change topic
       |
       +---- Explore weakness
       |
       +---- Continue interview

This creates a more dynamic and personalized interview experience.

RAG Knowledge Base

InterviewIQ uses Retrieval-Augmented Generation to ground interview-related knowledge.

The knowledge base contains curated information covering areas such as:

Role expectations
Technical interview domains
Behavioral interview guidance
HR interview guidance
Interview question design
Difficulty levels
Adaptive interviewing principles
Answer evaluation criteria
Interview best practices
Grounding and safety rules

The knowledge base is integrated with IBM watsonx Orchestrate.

Why RAG is Used

A language model can generate plausible responses, but interview preparation requires consistent and grounded guidance.

RAG allows the system to:

Receive an interview-related request
Identify the relevant knowledge requirement
Retrieve relevant information
Use retrieved information as context
Generate a grounded response

Conceptually:

User / Interview Context
          |
          v
   Knowledge Retrieval
          |
          v
Relevant Interview Knowledge
          |
          v
     AI Generation
          |
          v
 Grounded Response

The RAG layer also includes grounding rules to reduce unsupported claims and prevent the system from inventing candidate information or job requirements.

IBM Technologies Used
IBM Granite

Model: Granite 4.0 H Small

Granite is used as the core language intelligence layer for tasks such as:

Resume analysis
Candidate profile extraction
Job description analysis
Skill matching
Structured AI analysis
IBM watsonx.ai

watsonx.ai is used to access and integrate IBM Granite foundation models.

The project uses the IBM watsonx.ai API to communicate with the Granite model.

IBM watsonx Orchestrate

watsonx Orchestrate provides the agentic AI layer.

It is used for:

Agent configuration
Interview workflow
Adaptive interaction
Knowledge/RAG integration
Interview question generation
Candidate response handling
Evaluation and feedback
IBM Cloud

IBM Cloud provides the cloud environment for the IBM AI services used by the application.

The project follows a server-side integration approach so that IBM credentials are not exposed to the browser.

IBM watsonx Prompt Lab

Prompt Lab was used during the development and testing stage to experiment with prompts and validate Granite behavior before integrating the model into the application.

RAG Knowledge Base

A dedicated InterviewIQ knowledge base provides grounding for:

Interview expectations
Technical domains
Behavioral scenarios
HR guidance
Evaluation criteria
Adaptive interviewing
Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Backend
Next.js API Routes
TypeScript
AI / LLM
IBM Granite 4.0 H Small
IBM watsonx.ai
Agentic AI
IBM watsonx Orchestrate
Knowledge Retrieval
RAG
watsonx Orchestrate Knowledge Base
Infrastructure
IBM Cloud
Development
Git
GitHub
Node.js
npm
System Architecture

The application follows a layered architecture.

+---------------------------------------------------+
|                 InterviewIQ UI                    |
|             Next.js / React / TS                 |
+-------------------------+-------------------------+
                          |
                          v
+---------------------------------------------------+
|              Application API Layer               |
|              Next.js API Routes                  |
+-------------------------+-------------------------+
                          |
             +------------+------------+
             |                         |
             v                         v
+-------------------------+   +--------------------+
|      IBM Granite        |   | watsonx Orchestrate |
|       watsonx.ai        |   |    Agent + RAG     |
+-------------------------+   +--------------------+
             |                         |
             v                         v
+-------------------------+   +--------------------+
| Candidate / Job         |   | Interview Knowledge |
| Analysis                |   | Base                |
+-------------------------+   +--------------------+
             |                         |
             +------------+------------+
                          |
                          v
                Personalized Interview
                          |
                          v
                Evaluation + Feedback
Application Flow
Stage 1 — Candidate Input

The candidate provides:

Resume
Target role
Optional job description
Stage 2 — Candidate Analysis

Granite processes the resume and extracts structured candidate information.

Stage 3 — Job Analysis

The provided job description is analyzed to identify important requirements.

Stage 4 — Skill Matching

The system compares the candidate profile with the role requirements.

Stage 5 — Interview Preparation

InterviewIQ creates a personalized preparation context.

Stage 6 — Agentic Interview

watsonx Orchestrate conducts the interactive interview.

The agent uses:

Candidate profile
Target role
Job requirements
Previous answers
Retrieved interview knowledge
Stage 7 — Answer Evaluation

Candidate responses are evaluated against structured criteria.

Stage 8 — Feedback

InterviewIQ provides:

Strengths
Weaknesses
Improvement suggestions
Areas requiring additional preparation
Stage 9 — Performance Report

The interview results can be used to create an overall performance view and improvement roadmap.

Granite Integration

The application communicates with IBM watsonx.ai from the server side.

The integration is implemented in:

apps/web/lib/ibm/granite.ts

The IAM authentication logic is implemented in:

apps/web/lib/ibm/iam.ts

The application uses IBM IAM authentication to obtain an access token and then communicates with the watsonx.ai Granite API.

The Granite integration is used primarily for structured analysis rather than exposing the model directly to the client.

watsonx Orchestrate Integration

The watsonx Orchestrate integration is implemented in:

apps/web/lib/ibm/orchestrate.ts

The application communicates with the deployed InterviewIQ agent using IBM's agent interaction interface.

The deployed agent is responsible for the conversational interview experience and knowledge-grounded reasoning.

The frontend communicates with the application's backend rather than directly exposing IBM credentials.

Candidate Profiling

Candidate profiling converts unstructured resume information into a structured representation.

Example conceptual output:

Candidate
├── Education
├── Experience
├── Projects
├── Skills
├── Technologies
├── Certifications
└── Achievements

This profile becomes contextual information for subsequent interview preparation.

The system is instructed not to invent candidate information that is not supported by the resume.

Job Analysis and Skill Gap Analysis

The job analysis pipeline can be represented as:

Job Description
       |
       v
Requirement Extraction
       |
       v
Required Skills
       |
       v
Candidate Skill Comparison
       |
       +------------------+
       |                  |
       v                  v
    Strengths           Gaps
       |                  |
       +--------+---------+
                |
                v
       Preparation Priorities

The distinction between explicit job requirements and inferred recommendations is maintained to reduce unsupported claims.

Adaptive Interviewing

A major goal of InterviewIQ is to avoid a completely fixed interview sequence.

The interview context can include:

Candidate Profile
Target Role
Job Requirements
Current Topic
Previous Questions
Previous Answers
Evaluation Results
Interview Progress

This context allows the next question to be selected based on the current state of the interview.

For example:

Strong Technical Answer
        |
        v
More Advanced Question

or:

Incomplete Answer
        |
        v
Clarifying Follow-up

or:

Repeated Weakness
        |
        v
Additional Assessment
Answer Evaluation

InterviewIQ follows an evidence-based evaluation approach.

Evaluation can consider:

Relevance

Does the answer address the question?

Correctness

Is the technical or conceptual information accurate?

Completeness

Does the answer cover important aspects?

Reasoning

Does the candidate explain why or how?

Communication

Is the answer structured and understandable?

Evidence

Does the candidate support the answer with an example where appropriate?

Depth

Does the response demonstrate appropriate understanding for the target role?

The system is designed to avoid making strong conclusions about a candidate based on one answer alone.

Project Structure
InterviewIQ-Agentic-AI-Interview-Trainer/
│
├── README.md
├── problemstatement.pdf
├── InterviewIQ_Agent_PROJECT.pptx
│
├── package.json
├── package-lock.json
├── .gitignore
│
├── apps/
│   └── web/
│       │
│       ├── app/
│       │   ├── api/
│       │   │   ├── analyze/
│       │   │   ├── ibm/
│       │   │   ├── interview/
│       │   │   └── resume/
│       │   │
│       │   ├── (app)/
│       │   │   ├── profile/
│       │   │   └── interview/
│       │   │
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── ...
│       │
│       ├── components/
│       │   ├── interview/
│       │   ├── layout/
│       │   └── ui/
│       │
│       ├── config/
│       │   ├── app.config.ts
│       │   └── ibm.config.ts
│       │
│       ├── lib/
│       │   ├── ibm/
│       │   │   ├── granite.ts
│       │   │   ├── iam.ts
│       │   │   ├── orchestrate.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── store/
│       │   ├── utils/
│       │   └── validators/
│       │
│       ├── types/
│       │
│       ├── styles/
│       │
│       ├── .env.example
│       ├── .gitignore
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── tsconfig.json
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DEVELOPMENT_PLAN.md
    └── IBM_INTEGRATION.md
Getting Started
Prerequisites

Before running InterviewIQ locally, install:

Node.js
npm
Git

You also need access to the IBM services required by the project.

1. Clone the Repository
git clone https://github.com/UMESHKRISHNAA2006/InterviewIQ-Agentic-AI-Interview-Trainer.git

Navigate into the project:

cd InterviewIQ-Agentic-AI-Interview-Trainer
2. Install Dependencies

Install the root dependencies:

npm install

Then navigate to the web application:

cd apps/web

Install the web application dependencies:

npm install
Environment Variables

Create a local environment file:

apps/web/.env.local

Use .env.example as the template.

Example:

IBM_WATSONX_API_KEY=your_ibm_watsonx_api_key
IBM_WATSONX_PROJECT_ID=your_watsonx_project_id
IBM_WATSONX_BASE_URL=https://us-south.ml.cloud.ibm.com

IBM_ORCHESTRATE_API_KEY=your_orchestrate_api_key
IBM_ORCHESTRATE_INSTANCE_URL=your_orchestrate_instance_url

Never commit .env.local or any API keys to GitHub.

Running the Application

From the web application directory:

cd apps/web

Start the development server:

npm run dev

The application will normally be available at:

http://localhost:3000
Production Build

To verify the application build:

npm run build

Type checking:

npm run typecheck

Linting:

npm run lint

The project was validated using TypeScript checking, linting, and a production Next.js build during development.

IBM Cloud Configuration

InterviewIQ uses IBM Cloud services for its AI functionality.

The major configuration components are:

IBM Cloud
   |
   +-- watsonx.ai
   |      |
   |      +-- Granite 4.0 H Small
   |
   +-- watsonx Orchestrate
          |
          +-- InterviewIQ Agent
          |
          +-- Knowledge Base / RAG

Credentials are handled through environment variables and server-side API routes.

Security

Security is an important part of the project architecture.

API Keys

IBM API keys are stored in environment variables.

They are never intended to be hardcoded into source files.

Server-Side IBM Integration

IBM API calls are performed from the server-side application layer.

The frontend does not directly receive IBM API credentials.

Environment Files

The repository ignores local environment files such as:

.env.local
.env*.local

Only the example environment file is included:

.env.example
Candidate Data

Candidate information should be handled carefully.

Production deployments should implement appropriate:

Data protection
Access controls
Secure storage
Retention policies
Privacy policies

before handling sensitive real-world candidate information at scale.

Testing and Validation

The project was tested during development across the major AI components.

Granite Validation

Granite was tested for:

Resume/profile extraction
Structured JSON output
Job analysis
Interview-related reasoning

The Granite integration was also tested for response handling and API errors.

watsonx Orchestrate Validation

The InterviewIQ agent was tested using scenarios including:

AI Engineer Interview Expectations

The agent was tested to verify that role-specific interview knowledge could be retrieved from the knowledge base.

Behavioral Interview

The agent was tested with behavioral interview scenarios.

Grounding / Hallucination Prevention

The agent was tested with unsupported requirements to verify that it would not invent requirements that were not provided.

Application Validation

The application was validated through:

TypeScript
    ↓
Lint
    ↓
Production Build
    ↓
Browser Testing
    ↓
Live IBM AI Integration
Project Documentation

Additional technical documentation is available in the docs directory.

Architecture
docs/ARCHITECTURE.md

Contains architectural information about the application.

Development Plan
docs/DEVELOPMENT_PLAN.md

Contains the project's development planning information.

IBM Integration
docs/IBM_INTEGRATION.md

Contains IBM service integration details.

Submission Files

This repository includes the required internship submission artifacts.

Problem Statement
problemstatement.pdf

Contains the project problem statement.

Project Presentation
InterviewIQ_Agent_PROJECT.pptx

Contains the project presentation covering the problem, solution, architecture, IBM technologies, agentic AI workflow, RAG implementation, features, and future scope.

Source Code

The complete application source code is available under:

apps/web/
Screenshots and Demo

The application includes an interactive workflow covering:

Landing Page
      ↓
Profile / Resume Setup
      ↓
Candidate Analysis
      ↓
Job / Role Setup
      ↓
Interview Preparation
      ↓
Live Interview
      ↓
Answer Evaluation
      ↓
Performance Report

Screenshots and additional visual documentation can be added under:

docs/screenshots/
Current Status

InterviewIQ currently provides a functional core implementation of the Agentic AI interview trainer.

Implemented
 Next.js web application
 Candidate profile setup
 Resume processing
 Granite integration
 Candidate profile extraction
 Job analysis
 Skill matching
 Interview preparation flow
 watsonx Orchestrate agent integration
 RAG knowledge base
 Adaptive interview interaction
 Candidate answer evaluation
 Interview session flow
 Performance reporting foundation
 IBM server-side integration
 Environment-based credential management
 Markdown-rendered AI responses
 Production build validation
Limitations

The current version is a project implementation and is not intended to represent a fully productionized enterprise recruitment platform.

Potential areas requiring additional engineering for production deployment include:

Persistent candidate accounts
Production database
Enterprise authentication
Advanced analytics
Long-term candidate history
Large-scale concurrent usage
Advanced observability
Data retention controls
Enterprise privacy and compliance
Advanced evaluation calibration
Future Scope
1. Voice-Based AI Interview

Add voice interaction so candidates can participate in realistic spoken interviews.

Potential capabilities:

Speech-to-text
Text-to-speech
Voice-based questioning
Communication analysis
Speaking pace analysis
2. Multilingual Interviews

Support multiple languages to make interview preparation accessible to a wider range of candidates.

3. Advanced Interview Analytics

Introduce deeper analytics such as:

Topic-wise performance
Question difficulty progression
Answer quality trends
Technical vs behavioral performance
Skill-level trends
Interview readiness scoring
4. Company-Specific Interview Preparation

Future versions could support company-specific preparation using approved and grounded information such as:

Interview formats
Role expectations
Publicly available technical domains
Organization-specific preparation material
5. Continuous Candidate Progress Tracking

Candidates could maintain a long-term preparation profile and track improvement across multiple interview sessions.

6. Advanced Personalization

Future versions could personalize interview difficulty and question selection even further based on historical performance.

Why InterviewIQ is Different

InterviewIQ is designed to be more than a question generator.

Agentic Interview Intelligence

The agent manages the interview interaction dynamically instead of following only a static question list.

RAG-Based Grounding

Interview knowledge is retrieved from a curated knowledge base to improve consistency and grounding.

Resume-Aware

Questions can be connected to the candidate's actual projects, skills, and experience.

Job-Aware

Preparation can be aligned with the target job description.

Adaptive

The interview can react to the candidate's previous responses.

Multi-Domain

The platform supports technical, behavioral, and HR-oriented interview preparation.

Feedback-Driven

The candidate receives structured evaluation and actionable feedback.

Improvement-Oriented

The goal is not only to conduct an interview but also to help the candidate improve.

Learning Outcomes

Building InterviewIQ provided practical experience in:

Generative AI application development
Large Language Models
IBM Granite
IBM watsonx.ai
IBM watsonx Orchestrate
Agentic AI
Retrieval-Augmented Generation
Prompt engineering
API integration
IAM authentication
Next.js
React
TypeScript
Server-side architecture
AI response handling
Git and GitHub
AI application security
Development Philosophy

InterviewIQ was developed with a focus on building a functional AI product rather than a simple chatbot demonstration.

The development process emphasized:

Problem
  ↓
Architecture
  ↓
IBM Service Validation
  ↓
AI Integration
  ↓
Agent Integration
  ↓
RAG Grounding
  ↓
Application Development
  ↓
Testing
  ↓
GitHub Submission

The system was developed incrementally so that individual IBM services could be validated before being combined into the complete workflow.

Contributing

Contributions and suggestions are welcome.

A typical contribution workflow is:

git clone <repository>
cd InterviewIQ-Agentic-AI-Interview-Trainer
git checkout -b feature/your-feature

Make your changes, test them, and create a pull request.

Before submitting changes, verify:

npm run typecheck
npm run lint
npm run build
License

This project was developed as part of an academic/internship project.

A formal open-source license can be added if the project is later released for external contributions or production use.

Acknowledgements

This project was developed using IBM's AI and cloud ecosystem, including:

IBM Granite
IBM watsonx.ai
IBM watsonx Orchestrate
IBM Cloud
IBM watsonx Prompt Lab

The project was developed as an Agentic AI interview-training solution with the goal of demonstrating practical application of Generative AI, RAG, and Agentic AI technologies.

Project
InterviewIQ — Agentic AI Interview Trainer

Built with IBM Granite + watsonx.ai + watsonx Orchestrate + RAG + Next.js

Personalized. Adaptive. Grounded. AI-powered.
