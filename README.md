"# Team-2" 
Implement Phase 1 only.

GOAL

Create the initial project foundation for the AI Support Assistant.

Do NOT implement RAG, LLM integration, screen analysis, meetings, emails, or document processing yet.

BACKEND

Create a FastAPI project using:

- Python 3.12+
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
- Alembic
- PostgreSQL

Create a clean project structure.

Recommended structure:

backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── api/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   └── services/
├── tests/
├── alembic/
├── requirements.txt
└── Dockerfile

DATABASE

Configure PostgreSQL.

Create the SQLAlchemy database connection.

Configure Alembic.

Create the first migration.

HEALTH CHECK

Implement:

GET /api/v1/health

Response:

{
"status": "ok"
}

CONFIGURATION

Use Pydantic Settings.

Create:

.env.example

Do not hard-code secrets.

Include:

DATABASE_URL
LLM_BASE_URL
LLM_API_KEY
LLM_MODEL

The LLM variables are configuration placeholders only for now.

DOCKER

Create Dockerfile and docker-compose.yml.

docker-compose should initially contain:

- backend
- postgres

Use a PostgreSQL image with pgvector support if practical.

TESTING

Create basic pytest tests for:

- health endpoint
- database connectivity/configuration

IMPORTANT

Do not implement future features.

At the end provide:

1. Project structure.
2. All files created.
3. Commands to run the application.
4. Commands to run migrations.
5. Commands to run tests.
6. Expected output.
7. Explanation of how every major file works.
g
   Implement Phase 2 only.

The project foundation from Phase 1 already exists.

GOAL

Create the first real business functionality:

- Issues
- Workarounds
- Workaround steps
- Categories
- CRUD APIs

DATABASE

Create models for:

Issue

Fields should include:

- id
- title
- description
- symptoms
- error_message
- product
- application
- environment
- category
- severity
- status
- created_by
- created_at
- updated_at

Workaround

Fields:

- id
- issue_id
- title
- description
- expected_result
- verification_steps
- status
- created_by
- created_at
- updated_at

WorkaroundStep

Fields:

- id
- workaround_id
- step_number
- instruction

Use proper foreign keys and relationships.

STATUS

Issue status:

DRAFT
OPEN
RESOLVED
CLOSED
ARCHIVED

Workaround status:

DRAFT
PENDING_REVIEW
APPROVED
REJECTED
ARCHIVED

API

Implement:

POST /api/v1/issues
GET /api/v1/issues
GET /api/v1/issues/{id}
PATCH /api/v1/issues/{id}
DELETE /api/v1/issues/{id}

POST /api/v1/workarounds
GET /api/v1/workarounds
GET /api/v1/workarounds/{id}
PATCH /api/v1/workarounds/{id}
DELETE /api/v1/workarounds/{id}

REQUIREMENTS

Use:

- Pydantic request/response schemas
- SQLAlchemy repositories/services
- Proper HTTP status codes
- Validation
- Error handling

Do not put database logic directly in API routes.

TESTING

Add tests for:

- Creating an issue
- Getting an issue
- Updating an issue
- Deleting an issue
- Creating a workaround
- Linking a workaround to an issue
- Validation failures
- Not-found cases

Create the required Alembic migration.

Do not implement authentication or RAG yet.


Implement Phase 3 only.

Add authentication and role-based authorization.

ROLES

Create:

USER
SUPPORT_ENGINEER
KNOWLEDGE_EDITOR
ADMIN

USER MODEL

Create a users table containing appropriate fields such as:

- id
- username/email
- password hash or external identity identifier
- role
- is_active
- created_at
- updated_at

Do not store plaintext passwords.

AUTHENTICATION

Implement secure authentication.

Use JWT if appropriate for the initial implementation.

Create endpoints such as:

POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me

Protect existing issue/workaround APIs.

AUTHORIZATION

USER:

- Read permitted knowledge
- Ask questions later

SUPPORT_ENGINEER:

- Create issues
- Create workarounds
- Modify support information

KNOWLEDGE_EDITOR:

- Approve/reject knowledge

ADMIN:

- Full access

Enforce permissions on the backend.

Do not rely on frontend authorization.

AUDIT LOG

Create an audit_logs table.

Record actions such as:

- login
- issue creation
- issue modification
- workaround creation
- workaround modification
- knowledge approval

Do not log passwords, tokens, API keys, or sensitive content.

TESTS

Add tests for:

- Login
- Invalid credentials
- Protected endpoints
- Role restrictions
- Admin access
- Unauthorized access

Create required migrations.

Do not implement RAG yet.

Implement Phase 4 only.

GOAL

Integrate the company's LLM API.

IMPORTANT:

The company's LLM API is the only allowed AI provider.

Do not use OpenAI, Anthropic, Gemini, or another external provider.

ARCHITECTURE

Create:

LLMProvider

and:

CompanyLLMProvider

Application code should depend on LLMProvider rather than directly on CompanyLLMProvider.

Example conceptual interface:

class LLMProvider:

async def generate(...):
    ...

async def create_embedding(...):
    ...

async def analyze_image(...):
    ...

Do not assume all capabilities are available.

CONFIGURATION

Use:

LLM_BASE_URL
LLM_API_KEY
LLM_MODEL
LLM_EMBEDDING_MODEL
LLM_TIMEOUT

Never hard-code credentials.

SERVICE

Create:

llm_service.py

The service should handle:

- HTTP requests
- Authentication headers
- Timeout
- Errors
- Retries where appropriate
- Response parsing
- Logging without sensitive content

TESTING

Mock the company LLM API.

Do not make real API calls during tests.

Test:

- successful generation
- timeout
- authentication failure
- malformed response
- server error

DEMO ENDPOINT

Create:

POST /api/v1/llm/test

This should send a simple prompt to the company LLM and return the response.

Keep this endpoint protected.

Do not implement RAG yet.

Implement Phase 5 only.

GOAL

Implement Retrieval-Augmented Generation using PostgreSQL + pgvector.

The assistant must use the internal knowledge base before generating support answers.

VECTOR DATABASE

Enable pgvector.

Create appropriate vector columns/indexes.

Design the schema for:

- knowledge embeddings
- document chunks later
- metadata filtering

Do not create a separate vector database.

Use PostgreSQL + pgvector.

EMBEDDING PIPELINE

Implement:

Text
↓
Company LLM embedding API
↓
Vector
↓
PostgreSQL

Create an abstraction:

EmbeddingService

It must use the company's LLM API.

RETRIEVAL

Implement semantic similarity search.

Search:

- issues
- workarounds
- relevant knowledge

Only APPROVED knowledge should normally be treated as verified knowledge.

Support metadata such as:

- product
- application
- category
- severity
- environment

CHAT

Implement:

POST /api/v1/chat

Flow:

User question
↓
Generate query embedding
↓
Search pgvector
↓
Retrieve relevant knowledge
↓
Construct context
↓
Send context to company LLM
↓
Return grounded answer

PROMPT

The LLM must be instructed:

"You are an internal IT support assistant.

Use the supplied organizational knowledge as the primary source.

Do not invent company-specific procedures.

If the supplied knowledge does not contain a verified solution, explicitly say so.

General troubleshooting suggestions must be clearly identified as suggestions.

Never claim a workaround is verified unless it exists in the supplied approved knowledge."

RESPONSE

Return:

{
"answer": "...",
"sources": [],
"confidence": "high|medium|low"
}

CONFIDENCE

HIGH:
Exact approved solution found.

MEDIUM:
Related knowledge found but not exact.

LOW:
No strong internal knowledge found.

TESTING

Test:

- embedding generation
- vector storage
- similarity retrieval
- approved vs draft knowledge
- RAG prompt construction
- grounded response
- no-knowledge scenario

Do not implement documents, emails, meetings, or screen analysis yet.


Implement Phase 6 only.

GOAL

Allow users to upload company documents and add them to the RAG knowledge base.

Support initially:

- PDF
- DOCX
- TXT
- PPTX
- XLSX
- CSV
- PNG
- JPG
- JPEG

PIPELINE

Upload
↓
Validate
↓
Store
↓
Extract content
↓
OCR when required
↓
Chunk text
↓
Generate embeddings using company LLM
↓
Store chunks + vectors in PostgreSQL

DATABASE

Create:

documents
document_chunks

Document fields should include:

- id
- filename
- mime_type
- size
- hash
- owner
- status
- created_at
- updated_at

Document chunk:

- id
- document_id
- chunk_index
- content
- page_number if available
- embedding
- metadata

SECURITY

Validate:

- file type
- MIME type
- extension
- file size

Do not blindly trust the filename extension.

Do not execute uploaded files.

API

Implement:

POST /api/v1/files/upload
GET /api/v1/files
GET /api/v1/files/{id}
DELETE /api/v1/files/{id}

Processing can initially use FastAPI background tasks.

Design it so it can later move to a dedicated worker.

RAG

Include document chunks in semantic retrieval.

Return document sources where applicable.

Example:

Source:
VPN_Troubleshooting.pdf
Page: 12

TESTING

Test:

- supported file
- unsupported file
- oversized file
- extraction failure
- chunking
- embedding
- retrieval
- deletion


Implement Phase 7 only.

GOAL

Allow the React application to capture a screenshot/screen image and send it to the backend for analysis.

FRONTEND

Add:

[Capture Screen]

The browser should request appropriate screen/capture permissions.

Show a preview before analysis.

Provide:

[Analyze]

BACKEND

Implement:

POST /api/v1/screen/analyze

Accept an image.

Validate:

- MIME type
- size
- image format

AI FLOW

Screenshot
↓
Company Vision LLM
↓
Extract:

- Application
- Error message
- Visible warning
- UI state
- Possible problem

↓
RAG search
↓
Retrieve relevant internal knowledge
↓
Company LLM
↓
Troubleshooting report

RESPONSE

Return:

Application
Detected Error
Observed State
Likely Cause
Verified Workaround
Suggested Troubleshooting
Sources
Confidence

IMPORTANT

The system must not claim that an internal workaround is verified unless it came from approved knowledge.

Do not permanently store screenshots by default.

Only save them if explicitly requested by the user.

COMPANY API

If the company's LLM does not support vision:

Do not substitute another provider.

Create the vision interface and clearly identify that the company must provide an approved vision-capable endpoint.

TESTING

Mock the vision API.

Test:

- valid screenshot
- invalid image
- oversized image
- LLM failure
- successful analysis
- RAG integration

- Implement Phase 8 only.

GOAL

Allow the support assistant to analyze support emails and suggest troubleshooting steps.

EMAIL DATA

Process:

- sender
- subject
- body
- attachments

ANALYSIS

Email
↓
Extract issue
↓
Identify:

- product
- application
- error
- symptoms
- environment
- urgency
- category

↓
RAG search
↓
Company LLM
↓
Support recommendation

OUTPUT

Return:

Detected Issue
Symptoms
Error
Application
Likely Cause
Verified Workaround
Suggested Steps
Sources
Confidence

SUPPORT REPLY

Add:

POST /api/v1/emails/{id}/generate-reply

Generate a professional support response based on retrieved knowledge.

The response must be editable by the user.

Never automatically send the email.

PROVIDER ABSTRACTION

Create:

EmailProvider

Do not assume Gmail or Outlook.

Allow future implementations for:

- Microsoft Graph
- Gmail
- IMAP
- Internal company email API

TESTING

Mock email provider and LLM.

Test:

- email parsing
- issue extraction
- RAG retrieval
- reply generation
- provider failures


Implement Phase 9 only.

GOAL

Create a meeting assistant that processes meeting recordings and generates structured summaries.

PIPELINE

Recording
↓
Audio extraction
↓
Speech-to-text
↓
Transcript
↓
Company LLM
↓
Summary

Extract:

- participants
- topics
- key points
- problems
- decisions
- action items
- owners
- deadlines
- open questions
- next steps

DATABASE

Create:

meetings
meeting_transcripts
meeting_summaries

API

Implement:

POST /api/v1/meetings
POST /api/v1/meetings/{id}/upload
POST /api/v1/meetings/{id}/transcribe
POST /api/v1/meetings/{id}/summarize

GET /api/v1/meetings
GET /api/v1/meetings/{id}
GET /api/v1/meetings/{id}/transcript
GET /api/v1/meetings/{id}/summary

TRANSCRIPTION

Create:

TranscriptionService

Use the company's approved speech-to-text API if available.

If unavailable, create an abstraction and clearly identify the missing company capability.

Do not silently use an external AI provider.

SUMMARY

Generate:

Meeting Summary
Participants
Topics Discussed
Problems
Decisions
Action Items
Owners
Due Dates
Open Questions
Next Steps

EXPORT

Allow summary export to:

- Markdown
- DOCX
- PDF

TESTING

Mock transcription and LLM services.

Test:

- upload
- transcription
- summary generation
- failed processing
- export

Implement Phase 10 only.

GOAL

Build the React frontend for the complete Support Assistant.

Use:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios or fetch

PAGES

Create:

Dashboard
Chat
Knowledge Base
Issues
Workarounds
Documents
Screen Analysis
Meetings
Emails
Settings

CHAT

Create a professional chat interface with:

- conversations
- message history
- markdown
- sources
- confidence
- loading state
- errors
- file upload
- screenshot attachment

KNOWLEDGE BASE

Create:

- issue list
- issue details
- create issue
- edit issue
- workaround management
- approval queue

SCREEN ANALYSIS

Provide:

Capture Screen
Preview
Analyze
Result

MEETINGS

Provide:

Upload Recording
Processing status
Transcript
Summary
Action Items
Download

EMAILS

Provide:

Email details
Analyze Issue
Recommendation
Generate Reply
Edit Reply

Do not automatically send email.

AUTHENTICATION

Implement login/logout.

Store authentication securely.

Protect routes.

Do not rely only on frontend authorization.

The backend remains authoritative.

UI

Use a clean professional support-dashboard design.

Prioritize usability over visual complexity.

Implement Phase 11 only.

GOAL

Allow support engineers to convert successful troubleshooting conversations into reusable knowledge.

Add:

[Save as Knowledge]

From a conversation, use the company LLM to extract:

Issue
Symptoms
Error
Application
Environment
Possible Cause
Root Cause
Workaround
Steps
Verification
Tags

Create the item as:

DRAFT

Then:

DRAFT
↓
PENDING_REVIEW
↓
APPROVED
↓
Embedding generation
↓
RAG index

IMPORTANT

Never automatically mark generated knowledge as APPROVED.

A human knowledge editor must approve it.

UI

Add:

Save as Knowledge
Review
Approve
Reject
Edit

RAG

Once approved:

Generate embeddings
Store vectors
Make available to retrieval

TESTING

Test:

- extraction
- draft creation
- approval
- rejection
- embedding after approval
- retrieval after approval
