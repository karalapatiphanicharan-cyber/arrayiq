from fastapi import APIRouter, HTTPException
from ..models.schemas import ArrayInput, SearchInput, AlgorithmResponse, Recommendation, ArrayAnalysis, BenchmarkResult
from ..algorithms.sorting import algorithms as sorting_algos
from ..algorithms.searching import algorithms as searching_algos
from ..algorithms.quantum import algorithms as quantum_algos
from ..validation.validator import validate_algorithm
from ..recommendation.engine import get_recommendations, analyze_array
from ..benchmark.engine import run_sorting_benchmark, run_searching_benchmark
from typing import List

router = APIRouter()

COMPLEXITIES = {
    "bubble_sort": ("O(n²)", "O(1)"),
    "selection_sort": ("O(n²)", "O(1)"),
    "insertion_sort": ("O(n²)", "O(1)"),
    "merge_sort": ("O(n log n)", "O(n)"),
    "quick_sort": ("O(n log n)", "O(log n)"),
    "heap_sort": ("O(n log n)", "O(1)"),
    "shell_sort": ("O(n (log n)²)", "O(1)"),
    "counting_sort": ("O(n + k)", "O(k)"),
    "radix_sort": ("O(nk)", "O(n + k)"),
    "bucket_sort": ("O(n + k)", "O(n)"),
    "tim_sort": ("O(n log n)", "O(n)"),
    "linear_search": ("O(n)", "O(1)"),
    "binary_search": ("O(log n)", "O(1)"),
    "jump_search": ("O(√n)", "O(1)"),
    "interpolation_search": ("O(log log n)", "O(1)"),
    "exponential_search": ("O(log n)", "O(1)"),
    "fibonacci_search": ("O(log n)", "O(1)"),
}

@router.post("/sort/{algorithm}")
async def sort_array(algorithm: str, data: ArrayInput):
    errors = validate_algorithm(algorithm, data.array)
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    algo_func = getattr(sorting_algos, algorithm, None)
    if algorithm == "merge_sort": algo_func = sorting_algos.merge_sort_wrapper
    if algorithm == "quick_sort": algo_func = sorting_algos.quick_sort_wrapper

    if not algo_func:
        raise HTTPException(status_code=404, detail="Algorithm not found")

    sorted_arr, runtime, comparisons, swaps = algo_func(data.array)
    tc, sc = COMPLEXITIES.get(algorithm, ("Unknown", "Unknown"))

    return AlgorithmResponse(
        sorted_array=sorted_arr,
        runtime=runtime,
        comparisons=comparisons,
        swaps=swaps,
        time_complexity=tc,
        space_complexity=sc
    )

@router.post("/search/{algorithm}")
async def search_array(algorithm: str, data: SearchInput):
    errors = validate_algorithm(algorithm, data.array, data.target)
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    algo_func = getattr(searching_algos, algorithm, None)
    if not algo_func:
        raise HTTPException(status_code=404, detail="Algorithm not found")

    found_idx, runtime, comparisons = algo_func(data.array, data.target)
    tc, sc = COMPLEXITIES.get(algorithm, ("Unknown", "Unknown"))

    return AlgorithmResponse(
        runtime=runtime,
        comparisons=comparisons,
        found_index=found_idx,
        time_complexity=tc,
        space_complexity=sc
    )

@router.post("/analyze", response_model=ArrayAnalysis)
async def analyze(data: ArrayInput):
    analysis = analyze_array(data.array)
    # Add median/mode
    import statistics
    if analysis.get("is_numeric") and data.array:
        analysis["median"] = statistics.median(data.array)
        try:
            analysis["mode"] = statistics.multimode(data.array)
        except:
            analysis["mode"] = []
    return analysis

@router.post("/recommend/{task_type}", response_model=List[Recommendation])
async def recommend(task_type: str, data: ArrayInput):
    return get_recommendations(data.array, task_type)

@router.post("/benchmark/sorting", response_model=List[BenchmarkResult])
async def benchmark_sorting(data: ArrayInput):
    return run_sorting_benchmark(data.array)

@router.post("/benchmark/searching", response_model=List[BenchmarkResult])
async def benchmark_searching(data: SearchInput):
    return run_searching_benchmark(data.array, data.target)

@router.post("/quantum/{algorithm}")
async def quantum_sim(algorithm: str, data: SearchInput):
    if algorithm == "grovers":
        return quantum_algos.grovers_simulation(data.array, data.target)
    elif algorithm == "amplitude_amplification":
        return quantum_algos.amplitude_amplification_simulation(data.array, data.target)
    elif algorithm == "quantum_walk":
        return quantum_algos.quantum_walk_search_simulation(data.array, data.target)
    elif algorithm == "quantum_bitonic_sort":
        return quantum_algos.quantum_bitonic_sort_simulation(data.array)
    else:
        raise HTTPException(status_code=404, detail="Quantum algorithm not found")
