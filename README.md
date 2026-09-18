# DocuLens - AI Document Similarity & Integrity Analyzer

DocuLens is a full-stack, local-first web application that performs deep semantic analysis on documents and text passages to identify similarities, potential paraphrasing, and document integrity issues.

Unlike traditional plagiarism checkers that rely on exact keyword matching, DocuLens uses Transformer-based AI models to understand the *actual meaning* of the text. This allows it to detect when passages have been rewritten or structurally changed while retaining the exact same semantic information.

## How It Works

DocuLens operates entirely locally on your machine in four core steps:

### 1. Deep Semantic AI
At the core of DocuLens is a HuggingFace Transformer model (`all-MiniLM-L6-v2`). When you provide text, the AI model converts your sentences into multi-dimensional mathematical vectors. This allows the system to compare the *meaning* of sentences rather than just the letters.

### 2. Processing & Chunking
When you upload a PDF or paste text into the two source panels:
- The backend cleans the text (removing excessive whitespace and noise).
- The text is split into logical "chunks" (usually sentences or short paragraphs).
- The system then runs thousands of mathematical calculations (Cosine Similarity) between every single chunk from Source 1 against every chunk from Source 2.

### 3. Three-Tier Similarity
The application doesn't just give you one arbitrary score. It breaks down the similarity into three specific metrics:
* **Semantic Match:** Catches paraphrasing and restructured sentences where the meaning is identical.
* **Lexical Match (TF-IDF):** Finds overlapping keywords and vocabulary frequency.
* **Exact Match:** Identifies word-for-word identical copying (Jaccard similarity).

### 4. Privacy First
DocuLens runs 100% locally on your machine. No documents are uploaded to external APIs (like OpenAI), and no databases are used. Your data stays entirely private and is cleared from memory as soon as you close or refresh the app.

---

## Key Features

- **Flexible Inputs**: Compare a PDF against another PDF, Pasted Text against Pasted Text, or a mix of both.
- **Side-by-Side Passage Comparison**: View highly similar passages side-by-side with exact page references.
- **Interactive Similarity Matrix**: Visual breakdown of similarity scores across the three different metrics.
- **Adjustable Sensitivity Threshold**: Change the strictness slider to catch loose paraphrasing (e.g., 50%) or only highly identical text (e.g., 90%).
- **Exportable Reports**: Download the raw JSON analysis results directly from the dashboard.
- **Dark Mode UI**: A polished, modern interface built with React and Tailwind CSS.

---

## Prerequisites & Requirements

Before you can run this project on your computer, ensure you have the following installed:
1. **Python 3.8+** (Required to run the AI backend)
2. **Node.js & npm** (Required to run the React frontend)
3. **Git** (Optional, for cloning the repository)

You do **not** need an external database or any API keys. Everything runs locally!

---

## How to Execute this Project

Because this is a full-stack application, you will need to run the **Backend** and the **Frontend** simultaneously in two separate terminal windows.

### Step 1: Start the Backend (FastAPI & AI Model)

Open your first terminal, navigate to the project folder, and run:

```bash
cd backend

# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install the required Python packages
pip install -r requirements.txt

# 4. Start the backend server
uvicorn main:app --reload --port 8000
```
*(Note: The very first time you run this, it will take a minute or two to download the HuggingFace AI model into memory. Once it says "Application startup complete", you are ready to move on).*

### Step 2: Start the Frontend (React UI)

Open a **second, new terminal window**, navigate to the project folder, and run:

```bash
cd frontend

# 1. Install the Node modules and dependencies
npm install

# 2. Start the development server
npm run dev
```

### Step 3: Open the Application

Once both servers are running:
1. Open your web browser and navigate to: **`http://localhost:5173`**
2. The DocuLens interface will load, and you can begin comparing documents!

---

## Optional: Generate Sample Documents

If you want some pre-made, semantically similar PDFs to test the application with, you can run the included Python script from the root of the project:

```bash
# Make sure you are in the main DocuLens folder
pip install reportlab
python generate_samples.py
```
This will create a `sample_documents/` folder containing `Document_A.pdf`, `Document_B.pdf`, and `Document_C.pdf`. You can upload these directly into the UI to see the AI in action.
