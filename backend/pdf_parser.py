import fitz  # PyMuPDF
import re

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= chunk_size:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
            
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def extract_chunks_from_pdf(file_path: str, document_name: str) -> list:
    chunks_metadata = []
    try:
        doc = fitz.open(file_path)
        chunk_idx = 0
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            cleaned_text = clean_text(text)
            
            if not cleaned_text:
                continue
                
            page_chunks = chunk_text(cleaned_text)
            for chunk in page_chunks:
                if len(chunk) < 20:
                    continue
                chunks_metadata.append({
                    "document": document_name,
                    "page": page_num + 1,
                    "chunk_index": chunk_idx,
                    "text": chunk
                })
                chunk_idx += 1
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
    return chunks_metadata

def extract_chunks_from_text(text: str, document_name: str) -> list:
    chunks_metadata = []
    cleaned_text = clean_text(text)
    if not cleaned_text:
        return chunks_metadata
        
    page_chunks = chunk_text(cleaned_text)
    chunk_idx = 0
    for chunk in page_chunks:
        if len(chunk) < 20:
            continue
        chunks_metadata.append({
            "document": document_name,
            "page": 1, # Text input is considered a single page
            "chunk_index": chunk_idx,
            "text": chunk
        })
        chunk_idx += 1
    return chunks_metadata
