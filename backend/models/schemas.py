from pydantic import BaseModel
from typing import List, Optional, Any, Union

class ArrayInput(BaseModel):
    array: List[Union[int, float, str]]

class SearchInput(ArrayInput):
    target: Union[int, float, str]

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
