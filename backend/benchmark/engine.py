import time
import tracemalloc
from ..algorithms.sorting.algorithms import *
from ..algorithms.searching.algorithms import *

def run_sorting_benchmark(arr, iterations=5):
    algorithms = {
        "Bubble Sort": bubble_sort,
        "Selection Sort": selection_sort,
        "Insertion Sort": insertion_sort,
        "Merge Sort": merge_sort_wrapper,
        "Quick Sort": quick_sort_wrapper,
        "Heap Sort": heap_sort,
        "Shell Sort": shell_sort,
        "Counting Sort": counting_sort,
        "Radix Sort": radix_sort,
        "Bucket Sort": bucket_sort,
        "Tim Sort": tim_sort
    }

    results = []
    for name, func in algorithms.items():
        try:
            # Protection for slow algos
            if len(arr) > 5000 and name in ["Bubble Sort", "Selection Sort"]:
                continue

            # Memory measurement
            tracemalloc.start()

            total_time = 0
            # Execute multiple iterations for high-precision averaging
            # We don't include the first "warmup" run in the time, but we use it for metrics
            _, _, r_comps, r_swaps = func(list(arr))

            for _ in range(iterations):
                start = time.perf_counter()
                func(list(arr))
                total_time += (time.perf_counter() - start)

            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()

            avg_runtime = (total_time / iterations) * 1000 # convert to ms

            results.append({
                "name": name,
                "runtime": avg_runtime,
                "comparisons": r_comps,
                "swaps": r_swaps,
                "memory": peak / 1024 / 1024 # MB
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")
            if tracemalloc.is_tracing():
                tracemalloc.stop()

    return sorted(results, key=lambda x: x["runtime"])

def run_searching_benchmark(arr, target, iterations=5):
    algorithms = {
        "Linear Search": linear_search,
        "Binary Search": binary_search,
        "Jump Search": jump_search,
        "Interpolation Search": interpolation_search,
        "Exponential Search": exponential_search,
        "Fibonacci Search": fibonacci_search
    }

    results = []
    is_sorted = arr == sorted(arr)

    for name, func in algorithms.items():
        try:
            if name != "Linear Search" and not is_sorted:
                continue

            tracemalloc.start()
            total_time = 0
            found_idx, _, r_comps = func(arr, target)

            for _ in range(iterations):
                start = time.perf_counter()
                func(arr, target)
                total_time += (time.perf_counter() - start)

            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()

            results.append({
                "name": name,
                "runtime": (total_time / iterations) * 1000,
                "comparisons": r_comps,
                "found_index": found_idx,
                "memory": peak / 1024 / 1024 # MB
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")
            if tracemalloc.is_tracing():
                tracemalloc.stop()

    return sorted(results, key=lambda x: x["runtime"])
