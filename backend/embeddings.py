from sentence_transformers import SentenceTransformer
import os

class EmbeddingModel:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingModel, cls).__new__(cls)
            print("Loading SentenceTransformer model...")
            # Using all-MiniLM-L6-v2 as requested, good balance of speed and performance
            cls._instance._model = SentenceTransformer('all-MiniLM-L6-v2')
            print("Model loaded.")
        return cls._instance

    def encode(self, texts: list):
        return self._model.encode(texts)

def get_embedding_model():
    return EmbeddingModel()
