

# Document AI Assistant

This project answers FAQs based on policy documents. The chatbot uses natural language processing  to extract relevant information from uploaded policy PDFs and respond to user queries.
<p align="center">
  <img width="1260" alt="Screenshot 2024-10-20 at 9 05 05 PM" src="https://github.com/user-attachments/assets/923a8ce8-722a-4691-84d5-751c58254ece">
</p>



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

### 3. Storybook

You can view the react components in isolation in storybook

```bash
npm run storybook
```


### 4. Run with Docker

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

## Document Loader

To load documents run the following command:

```bash
npm run load-pdf -- example.pdf
```

I've included the example pdf in the `/example_documents` folder for your convenience


## Architectural & Design Choices

I've implemented a simple RAG <> Single agent design.

- Cosine Distance, using Qdrant
- Chunking via Paragraph
- Feedback loop to evaluate messages
- model, GPT-4o
- embeddings, OpenAI text-embedding-ada-002

---

## Challenges & Improvements

Unfortunatly time wasnt on my side with this one, so I had to spin this up in between work and life. Some obvious improvements:

- Using Additional agents to evaluate the responses
- Moving to a more flexible orchestrator like langchian
- Chunking more intellengently with llm's rather that a regex + algorithm
- Pre processing and summarizing documents with llms for quick extrapolation
- Experimenting with different llm responses and determining which has the best answer
- Prompt fine tuning