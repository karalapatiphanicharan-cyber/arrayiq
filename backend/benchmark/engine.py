import time
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

            total_time = 0
            total_comps = 0
            total_swaps = 0

            # Execute first run to warm up and get comps/swaps
            _, r_time, r_comps, r_swaps = func(list(arr))
            total_time += r_time
            total_comps = r_comps
            total_swaps = r_swaps

            for _ in range(iterations - 1):
                _, r_time, _, _ = func(list(arr))
                total_time += r_time

            avg_runtime = total_time / iterations

            results.append({
                "name": name,
                "runtime": avg_runtime,
                "comparisons": total_comps,
                "swaps": total_swaps
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")

    # Strictly rank by runtime
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

            total_time = 0
            total_comps = 0
            found_idx = -1

            _, r_time, r_comps = func(arr, target)
            total_time += r_time
            total_comps = r_comps

            for _ in range(iterations - 1):
                idx, r_time, _ = func(arr, target)
                total_time += r_time
                found_idx = idx

            results.append({
                "name": name,
                "runtime": total_time / iterations,
                "comparisons": total_comps,
                "found_index": found_idx
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")

    return sorted(results, key=lambda x: x["runtime"])
