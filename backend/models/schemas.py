from pydantic import BaseModel
from typing import List, Any, Optional

class ArrayInput(BaseModel):
    array: List[Any]

class SearchInput(BaseModel):
    array: List[Any]
    target: Optional[Any] = None

class QuantumSortInput(BaseModel):
    array: List[Any]

class ComparisonInput(BaseModel):
    array: List[Any]
    target: Optional[Any] = None
    algorithms: List[str]

class AlgorithmResponse(BaseModel):
    sorted_array: Optional[List[Any]] = None
    found_index: Optional[int] = None
    runtime: float
    comparisons: int
    swaps: Optional[int] = None
    time_complexity: str
    space_complexity: str

class Recommendation(BaseModel):
    name: str
    confidence: int
    reason: str

class ArrayAnalysis(BaseModel):
    size: int
    is_sorted: bool
    duplicates: int
    is_numeric: bool
    is_integer: bool
    min: Optional[float] = None
    max: Optional[float] = None
    sum: Optional[float] = None
    avg: Optional[float] = None
    median: Optional[float] = None
    mode: Optional[List[Any]] = None
    nearly_sorted: Optional[bool] = None

class BenchmarkResult(BaseModel):
    name: str
    runtime: float
    comparisons: int
    swaps: Optional[int] = None
    memory: float
    best_case: str
    avg_case: str
    worst_case: str
    found_index: Optional[int] = None
