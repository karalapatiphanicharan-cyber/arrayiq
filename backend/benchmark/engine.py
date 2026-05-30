from ..algorithms.sorting.algorithms import *
from ..algorithms.searching.algorithms import *

def run_sorting_benchmark(arr):
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
            # Skip slow ones for large arrays in benchmark
            if len(arr) > 2000 and name in ["Bubble Sort", "Selection Sort"]:
                continue

            sorted_arr, runtime, comparisons, swaps = func(arr[:])
            results.append({
                "name": name,
                "runtime": runtime,
                "comparisons": comparisons,
                "swaps": swaps
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")

    return sorted(results, key=lambda x: x["runtime"])

def run_searching_benchmark(arr, target):
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

            found_idx, runtime, comparisons = func(arr, target)
            results.append({
                "name": name,
                "runtime": runtime,
                "comparisons": comparisons,
                "found_index": found_idx
            })
        except Exception as e:
            print(f"Error benchmarking {name}: {e}")

    return sorted(results, key=lambda x: x["runtime"])
