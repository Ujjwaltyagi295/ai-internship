from sentence_transformers import SentenceTransformer
import numpy as np
from functools import lru_cache


class Embedder:
    """
    Wrapper for all-mpnet-base-v2 embeddings.
    """

    def __init__(self, model_name="sentence-transformers/all-mpnet-base-v2"):
        self.model = SentenceTransformer(model_name)

    def embed(self, text: str) -> np.ndarray:
        if not text:
            text = ""
        vec = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=False  # keep raw magnitudes for stronger signal
        )
        print("DEBUG: Embedding length:", len(vec))
        print("DEBUG: Embedding sample:", vec[:5])
        return vec


@lru_cache(maxsize=1)
def get_embedder() -> Embedder:
    return Embedder()

