from pydantic import BaseModel
from typing import List, Optional, Any, Union

class ArrayInput(BaseModel):
    array: List[Union[int, float, str]]

class SearchInput(ArrayInput):
    target: Union[int, float, str]

class ComparisonInput(ArrayInput):
    algorithms: List[str]
    target: Optional[Union[int, float, str]] = None

class AlgorithmResponse(BaseModel):
    sorted_array: Optional[List[Any]] = None
    runtime: float
    comparisons: int
    swaps: Optional[int] = None
    found_index: Optional[int] = None
    time_complexity: str
    space_complexity: str

class BenchmarkResult(BaseModel):
    name: str
    runtime: float
    comparisons: int
    swaps: Optional[int] = None
    found_index: Optional[int] = None
    memory: float
    best_case: str
    avg_case: str
    worst_case: str

class Recommendation(BaseModel):
    name: str
    confidence: int
    reason: str

class ArrayAnalysis(BaseModel):
    size: int
    min: Optional[Any] = None
    max: Optional[Any] = None
    avg: Optional[float] = None
    median: Optional[float] = None
    mode: Optional[List[Any]] = None
    duplicates: int
    is_sorted: bool
    nearly_sorted: Optional[bool] = None
    is_numeric: bool
