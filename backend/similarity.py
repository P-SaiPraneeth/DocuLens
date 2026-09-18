import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

def calculate_exact_similarity(text1: str, text2: str) -> float:
    """Calculate exact Jaccard similarity based on words."""
    words1 = set(re.findall(r'\w+', text1.lower()))
    words2 = set(re.findall(r'\w+', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
        
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union)

def calculate_lexical_similarity(texts1: list, texts2: list) -> float:
    """Calculate lexical similarity using TF-IDF."""
    if not texts1 or not texts2:
        return 0.0
        
    # Combine chunks to document level for lexical sim
    doc1_text = " ".join(texts1)
    doc2_text = " ".join(texts2)
    
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([doc1_text, doc2_text])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(sim)
    except ValueError:
        # Happens if texts are empty or contain no words
        return 0.0

def calculate_cosine_similarity(vec1, vec2) -> float:
    """Calculate cosine similarity between two vectors."""
    # reshape if necessary
    if len(vec1.shape) == 1:
        vec1 = vec1.reshape(1, -1)
    if len(vec2.shape) == 1:
        vec2 = vec2.reshape(1, -1)
        
    sim = cosine_similarity(vec1, vec2)[0][0]
    return float(sim)
