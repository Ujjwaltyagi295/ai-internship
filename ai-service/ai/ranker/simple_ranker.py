import numpy as np
from typing import Iterable


class SimpleRanker:
    """
    Lightweight fallback scorer that converts the feature vector into
    a single score in the 0-1 range using fixed weights.
    """

    def __init__(self) -> None:
        # Keep weights aligned with the features produced by FeatureBuilder.
        self.weights = np.array([
            0.30,   # semantic similarity
            0.20,   # required skills coverage
            0.10,   # related skills coverage
            0.08,   # tool overlap
            -0.08,  # missing required skills (penalty)
            0.08,   # domain match
            0.06,   # title overlap
            0.06,   # role title match
            0.05,   # degree/major match
            0.04,   # experience match
            0.01,   # GPA normalized
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
