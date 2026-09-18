from pdf_parser import extract_chunks_from_pdf, extract_chunks_from_text
from embeddings import get_embedding_model
from similarity import calculate_exact_similarity, calculate_lexical_similarity, calculate_cosine_similarity
from models import AnalysisResponse, DocumentSummary, DocumentSimilarity, PassageMatch, Summary

def analyze_documents(documents_data: dict, threshold: float = 0.50) -> dict:
    """
    documents_data: dict of document_name -> {"type": "pdf"|"text", "path": str, "content": str}
    """
    model = get_embedding_model()
    
    all_chunks = []
    doc_summaries = {}
    
    # 1. Parse documents
    for doc_name, data in documents_data.items():
        if data["type"] == "pdf":
            chunks = extract_chunks_from_pdf(data["path"], doc_name)
        else:
            chunks = extract_chunks_from_text(data["content"], doc_name)
            
        all_chunks.extend(chunks)
        
        pages = set([c["page"] for c in chunks])
        
        doc_summaries[doc_name] = DocumentSummary(
            name=doc_name,
            pages=len(pages),
            chunks=len(chunks)
        )
        
    if not all_chunks:
        raise ValueError("No text could be extracted from the provided documents.")
        
    # 2. Generate Embeddings for all chunks at once (batching)
    texts = [c["text"] for c in all_chunks]
    embeddings = model.encode(texts)
    
    for i, chunk in enumerate(all_chunks):
        chunk["embedding"] = embeddings[i]
        
    # Group chunks by document
    docs_chunks = {}
    for chunk in all_chunks:
        docs_chunks.setdefault(chunk["document"], []).append(chunk)
        
    doc_names = list(docs_chunks.keys())
    
    document_similarities = []
    passage_matches = []
    highest_sim = 0.0
    
    # 3. Compare pairs
    for i in range(len(doc_names)):
        for j in range(i + 1, len(doc_names)):
            doc_a = doc_names[i]
            doc_b = doc_names[j]
            
            chunks_a = docs_chunks.get(doc_a, [])
            chunks_b = docs_chunks.get(doc_b, [])
            
            texts_a = [c["text"] for c in chunks_a]
            texts_b = [c["text"] for c in chunks_b]
            
            lexical_sim = calculate_lexical_similarity(texts_a, texts_b)
            
            full_text_a = " ".join(texts_a)
            full_text_b = " ".join(texts_b)
            exact_sim = calculate_exact_similarity(full_text_a, full_text_b)
            
            doc_highest_semantic = 0.0
            
            for chunk_a in chunks_a:
                for chunk_b in chunks_b:
                    sim = calculate_cosine_similarity(chunk_a["embedding"], chunk_b["embedding"])
                    
                    if sim > doc_highest_semantic:
                        doc_highest_semantic = sim
                        
                    if sim > highest_sim:
                        highest_sim = sim
                        
                    if sim >= threshold:
                        passage_matches.append(PassageMatch(
                            document_a=doc_a,
                            page_a=chunk_a["page"],
                            text_a=chunk_a["text"],
                            document_b=doc_b,
                            page_b=chunk_b["page"],
                            text_b=chunk_b["text"],
                            semantic_similarity=float(sim)
                        ))
                        
            document_similarities.append(DocumentSimilarity(
                document_a=doc_a,
                document_b=doc_b,
                exact_similarity=exact_sim,
                lexical_similarity=lexical_sim,
                semantic_similarity=doc_highest_semantic
            ))
            
    passage_matches.sort(key=lambda x: x.semantic_similarity, reverse=True)
    passage_matches = passage_matches[:50]
    
    summary = Summary(
        documents_analyzed=len(doc_names),
        total_chunks=len(all_chunks),
        highest_similarity=highest_sim,
        potential_matches=len(passage_matches)
    )
    
    response = AnalysisResponse(
        summary=summary,
        documents=list(doc_summaries.values()),
        document_similarity=document_similarities,
        passage_matches=passage_matches
    )
    
    return response.model_dump()
