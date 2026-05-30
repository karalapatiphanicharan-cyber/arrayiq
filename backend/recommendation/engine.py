import numpy as np
import statistics

def analyze_array(arr):
    if not arr:
        return {}
    n = len(arr)
    is_numeric = all(isinstance(x, (int, float)) for x in arr)
    is_integer = all(isinstance(x, int) for x in arr)

    # Accurate sortedness check
    is_sorted = False
    if n > 0:
        is_sorted = all(arr[i] <= arr[i+1] for i in range(n-1))

    analysis = {
        "size": n,
        "is_sorted": is_sorted,
        "duplicates": n - len(set(arr)),
        "is_numeric": is_numeric,
        "is_integer": is_integer,
    }

    if is_numeric and n > 0:
        analysis.update({
            "min": min(arr),
            "max": max(arr),
            "sum": sum(arr),
            "avg": sum(arr) / n,
            "range": max(arr) - min(arr),
            "nearly_sorted": is_nearly_sorted(arr),
            "is_uniform": is_uniformly_distributed(arr) if is_sorted else False,
            "has_negative": any(x < 0 for x in arr)
        })
    return analysis

def is_nearly_sorted(arr):
    n = len(arr)
    if n <= 1: return True
    in_order = sum(1 for i in range(n-1) if arr[i] <= arr[i+1])
    # Definition: > 80% elements are in correct relative order
    return (in_order / (n-1)) > 0.80

def is_uniformly_distributed(arr):
    n = len(arr)
    if n < 10: return False
    diffs = [arr[i+1] - arr[i] for i in range(n-1)]
    if not diffs: return True
    avg_diff = sum(diffs) / len(diffs)
    if avg_diff == 0: return True
    # Check coefficient of variation
    std_diff = statistics.stdev(diffs) if len(diffs) > 1 else 0
    return (std_diff / avg_diff) < 0.25

def get_sorting_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []
    recs = []
    size = analysis["size"]

    if analysis.get("is_sorted"):
        recs.append({"name": "Tim Sort", "confidence": 100, "reason": "Array is already sorted. Tim Sort (standard in Python/JS) will recognize this in O(n) time."})
    elif analysis.get("nearly_sorted"):
        recs.append({"name": "Insertion Sort", "confidence": 98, "reason": "High degree of order detected. Insertion sort excels at nearly-sorted datasets with O(n) efficiency."})
    elif analysis["is_integer"] and analysis.get("range", 0) < size * 2 and not analysis.get("has_negative"):
        recs.append({"name": "Counting Sort", "confidence": 96, "reason": "Small, non-negative integer range relative to size. Counting sort provides linear O(n+k) performance."})
    elif size > 500:
        recs.append({"name": "Quick Sort", "confidence": 94, "reason": "Large random dataset. Quick Sort typically offers the best cache performance and average-case speed."})
        recs.append({"name": "Merge Sort", "confidence": 88, "reason": "Guaranteed O(n log n) performance regardless of data distribution and stable sorting."})
    else:
        recs.append({"name": "Quick Sort", "confidence": 92, "reason": "Optimal for most small-to-medium random distributions."})

    return sorted(recs, key=lambda x: x["confidence"], reverse=True)

def get_searching_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []
    recs = []
    if not analysis.get("is_sorted"):
        recs.append({"name": "Linear Search", "confidence": 100, "reason": "Array is NOT sorted. Sequential scanning is the only valid classical search method without pre-sorting."})
    else:
        if analysis.get("is_uniform"):
            recs.append({"name": "Interpolation Search", "confidence": 97, "reason": "Sorted numeric array with uniform distribution. Can achieve O(log log n) speed by estimating target position."})
        recs.append({"name": "Binary Search", "confidence": 99, "reason": "Sorted dataset. Binary search is the most robust O(log n) lookup method."})

    return sorted(recs, key=lambda x: x["confidence"], reverse=True)

def get_suitability(arr, task_type="sorting"):
    analysis = analyze_array(arr)
    if not arr: return {"suitable": [], "unsuitable": []}
    suitable, unsuitable = [], []
    size = analysis["size"]

    if task_type == "sorting":
        configs = [
            ("Quick Sort", True, ""),
            ("Merge Sort", True, ""),
            ("Heap Sort", True, ""),
            ("Tim Sort", True, ""),
            ("Insertion Sort", True, ""),
            ("Shell Sort", True, ""),
            ("Bubble Sort", size < 1000, f"O(n²) is non-viable for size {size}. Execution would be too slow."),
            ("Selection Sort", size < 1000, f"O(n²) complexity makes Selection Sort inefficient for size {size}."),
            ("Counting Sort", analysis["is_integer"] and not analysis.get("has_negative"), "Counting sort requires non-negative integers for index-based frequency mapping."),
            ("Radix Sort", analysis["is_integer"] and not analysis.get("has_negative"), "Radix sort requires positive integer representation for digit-by-digit distribution."),
            ("Bucket Sort", analysis["is_numeric"], "Bucket sort requires numeric values for interval partitioning.")
        ]
        for name, is_s, reason in configs:
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})

    elif task_type == "searching":
        is_sorted = analysis.get("is_sorted", False)
        configs = [
            ("Linear Search", True, ""),
            ("Binary Search", is_sorted, "Binary search requires sorted data to perform divide-and-conquer halving."),
            ("Jump Search", is_sorted, "Requires sorted data to jump through blocks accurately."),
            ("Fibonacci Search", is_sorted, "Requires sorted data for Fibonacci-based range reduction."),
            ("Exponential Search", is_sorted, "Requires sorted data for exponential range finding."),
            ("Interpolation Search", is_sorted and analysis.get("is_numeric"), "Requires sorted numeric data for proportional target estimation.")
        ]
        for name, is_s, reason in configs:
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})

    return {"suitable": suitable, "unsuitable": unsuitable}
