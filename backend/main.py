from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
import shutil
import uuid
from analyzer import analyze_documents
from embeddings import get_embedding_model

app = FastAPI(title="DocuLens API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pre-load model on startup
@app.on_event("startup")
async def startup_event():
    get_embedding_model()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze(
    doc1_file: Optional[UploadFile] = File(None),
    doc1_text: Optional[str] = Form(None),
    doc1_name: Optional[str] = Form("Document 1"),
    
    doc2_file: Optional[UploadFile] = File(None),
    doc2_text: Optional[str] = Form(None),
    doc2_name: Optional[str] = Form("Document 2"),
    
    threshold: float = Form(0.65)
):
    
    if not (doc1_file or doc1_text) or not (doc2_file or doc2_text):
        raise HTTPException(status_code=400, detail="Please provide both Source 1 and Source 2 (either as PDF or Text).")
        
    session_id = str(uuid.uuid4())
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)
    
    documents_data = {}
    
    try:
        # Process Source 1
        if doc1_file and doc1_file.filename:
            file_path = os.path.join(session_dir, doc1_file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(doc1_file.file, buffer)
            documents_data[doc1_file.filename or doc1_name] = {"type": "pdf", "path": file_path}
        elif doc1_text:
            documents_data[doc1_name] = {"type": "text", "content": doc1_text}
            
        # Process Source 2
        if doc2_file and doc2_file.filename:
            file_path = os.path.join(session_dir, doc2_file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(doc2_file.file, buffer)
            documents_data[doc2_file.filename or doc2_name] = {"type": "pdf", "path": file_path}
        elif doc2_text:
            documents_data[doc2_name] = {"type": "text", "content": doc2_text}
            
        # Analyze
        results = analyze_documents(documents_data, threshold=threshold)
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(session_dir):
            shutil.rmtree(session_dir)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
