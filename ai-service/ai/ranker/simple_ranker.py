import numpy as np
from typing import Iterable


class SimpleRanker:
    """
    Lightweight fallback scorer that converts the feature vector into
    a single score in the 0-1 range using fixed weights.
    """

    def __init__(self) -> None:
        # Keep weights aligned with the 5 features produced by FeatureBuilder.
        self.weights = np.array([
            0.62,  # semantic similarity
            0.30,  # skill overlap ratio
            0.03,  # branch match
            0.03,  # domain match
            0.02,  # GPA normalized
        ], dtype=float)

    def score(self, features: Iterable[float]) -> float:
        vec = np.array(list(features), dtype=float).flatten()

        if vec.size < self.weights.size:
            # Pad missing feature slots with zeros to avoid index errors.
            vec = np.pad(vec, (0, self.weights.size - vec.size))

        # Only use as many features as we have weights for.
        vec = vec[: self.weights.size]
        raw = float(np.dot(vec, self.weights))

        # Clamp to a stable 0-1 range.
        return max(0.0, min(raw, 1.0))
