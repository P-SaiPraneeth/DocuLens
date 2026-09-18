from pydantic import BaseModel
from typing import List, Optional

class DocumentSummary(BaseModel):
    name: str
    pages: int
    chunks: int

class DocumentSimilarity(BaseModel):
    document_a: str
    document_b: str
    exact_similarity: float
    lexical_similarity: float
    semantic_similarity: float

class PassageMatch(BaseModel):
    document_a: str
    page_a: int
    text_a: str
    document_b: str
    page_b: int
    text_b: str
    semantic_similarity: float

class Summary(BaseModel):
    documents_analyzed: int
    total_chunks: int
    highest_similarity: float
    potential_matches: int

class AnalysisResponse(BaseModel):
    summary: Summary
    documents: List[DocumentSummary]
    document_similarity: List[DocumentSimilarity]
    passage_matches: List[PassageMatch]
