import os
import xgboost as xgb
import numpy as np
from typing import Optional
from ai.config import RANKER_PATH


class XGBRankerWrapper:
    def __init__(self):
        # Use regressor to support regression-trained model
        self.model: Optional[xgb.XGBRegressor] = None
        print("DEBUG: Checking for XGB model at:", RANKER_PATH)
        if os.path.exists(RANKER_PATH):
            print("DEBUG: XGB model found, loading...")
            m = xgb.XGBRegressor()
            m.load_model(RANKER_PATH)
            self.model = m
            print("DEBUG: XGB Model Loaded Successfully.")
        else:
            print("DEBUG: No XGB model found! Using fallback.")

    @property
    def available(self) -> bool:
        return self.model is not None

    def predict(self, X: np.ndarray) -> np.ndarray:
        if self.model is None:
            raise RuntimeError("Ranker model not loaded")
        return self.model.predict(X)

