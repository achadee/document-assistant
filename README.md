# Document AI Assistant

This project answers FAQs based on policy documents. The chatbot uses natural language processing  to extract relevant information from uploaded policy PDFs and respond to user queries.

## Features
- **Chatbot UI**: A simple front-end that allows users to ask questions and get responses from the chatbot.
- **Follow-up Questions**: Users can follow up with additional questions, and the chatbot will respond based on previous context.
- **Policy Document Upload**: The chatbot extracts answers from policy documents, specifically PDFs, to improve the accuracy of its responses.
- **AI Model**: The solution integrates a language model (e.g., OpenAI GPT) for natural language understanding and response generation.

---

## Prerequisites

- Docker
- Node.js

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/achadee/document-assistant.git
cd document-assistant
```

### 2. Environment Variables

Create a `.env` file in the root of your project with the following keys:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run with Docker

Build and start the application using Docker:

```bash
# Docker v1
docker-compose up --build

# or Docker v2
docker compose up --build
```

This command will:
- Set up the Next.js front-end
- Run the API for handling user queries and interacting with the AI model

The app will be available at: `http://localhost:3000`

---

## Project Structure

TODO

---

## API Endpoints

TODO

---

## Architectural & Design Choices

TODO

---

## Challenges & Improvements

TODO


---

## Running Locally (Without Docker)

Alternatively, you can run the app locally without Docker.

1. **Install Dependencies**:

```bash
npm install
```

2. **Run the App**:

```bash
npm run dev
```

The app will run on `http://localhost:3000`.

---