import numpy as np

def analyze_array(arr):
    if not arr:
        return {}
    n = len(arr)
    is_numeric = all(isinstance(x, (int, float)) for x in arr)
    is_integer = all(isinstance(x, int) for x in arr)
    is_sorted = arr == sorted(arr)
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
            "range": max(arr) - min(arr),
            "nearly_sorted": is_nearly_sorted(arr),
            "is_uniform": is_uniformly_distributed(arr) if is_sorted else False
        })
    return analysis

def is_nearly_sorted(arr):
    if len(arr) <= 1: return True
    in_order = sum(1 for i in range(len(arr)-1) if arr[i] <= arr[i+1])
    return (in_order / (len(arr)-1)) > 0.85

def is_uniformly_distributed(arr):
    if len(arr) < 15: return False
    diffs = [arr[i+1] - arr[i] for i in range(len(arr)-1)]
    if np.mean(diffs) == 0: return True
    return (np.std(diffs) / np.mean(diffs)) < 0.15

def get_sorting_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []
    recs = []
    size = analysis["size"]
    if analysis.get("nearly_sorted"):
        recs.append({"name": "Insertion Sort", "confidence": 98, "reason": "Array is already nearly sorted. Insertion sort will perform in near O(n) time."})
    elif analysis["is_integer"] and analysis.get("range", 0) < size * 1.5:
        recs.append({"name": "Counting Sort", "confidence": 95, "reason": "Small integer range detected relative to size. Counting sort provides O(n+k) linear time."})
    elif size > 2000:
        recs.append({"name": "Tim Sort", "confidence": 92, "reason": "Large complex dataset. Tim Sort is a world-class hybrid algorithm designed for real-world distributions."})
        recs.append({"name": "Quick Sort", "confidence": 90, "reason": "High-performance partitioning algorithm for large random datasets."})
    else:
        recs.append({"name": "Quick Sort", "confidence": 94, "reason": "Standard large random dataset. Quick Sort typically provides the fastest average-case performance."})
    if not any(r["name"] == "Merge Sort" for r in recs):
        recs.append({"name": "Merge Sort", "confidence": 85, "reason": "Stable sort requirement or worst-case O(n log n) guarantee needed."})
    return sorted(recs, key=lambda x: x["confidence"], reverse=True)

def get_searching_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []
    recs = []
    if not analysis["is_sorted"]:
        recs.append({"name": "Linear Search", "confidence": 100, "reason": "Array is unsorted. Linear search is the only reliable scan method without O(n log n) pre-sorting."})
    else:
        if analysis.get("is_uniform"):
            recs.append({"name": "Interpolation Search", "confidence": 96, "reason": "Sorted numeric array with uniform distribution. Offers O(log log n) theoretical performance."})
        elif analysis["size"] > 1000:
            recs.append({"name": "Binary Search", "confidence": 98, "reason": "Large sorted dataset. Binary search is the gold standard for O(log n) lookups."})
            recs.append({"name": "Jump Search", "confidence": 88, "reason": "Sorted array. Jump search reduces comparisons by stepping through blocks."})
        else:
            recs.append({"name": "Binary Search", "confidence": 95, "reason": "Standard sorted array lookup."})
    return sorted(recs, key=lambda x: x["confidence"], reverse=True)

def get_suitability(arr, task_type="sorting"):
    analysis = analyze_array(arr)
    if not arr: return {"suitable": [], "unsuitable": []}
    suitable, unsuitable = [], []
    if task_type == "sorting":
        algos = {
            "Quick Sort": (True, ""),
            "Merge Sort": (True, ""),
            "Heap Sort": (True, ""),
            "Tim Sort": (True, ""),
            "Insertion Sort": (True, ""),
            "Bubble Sort": (analysis["size"] < 3000, "O(n²) complexity is extremely inefficient for datasets of this size."),
            "Selection Sort": (analysis["size"] < 3000, "Quadratic complexity makes this non-viable for large arrays."),
            "Counting Sort": (analysis["is_integer"], "Requires discrete integer values for frequency indexing."),
            "Radix Sort": (analysis["is_integer"], "Bitwise/Radix distribution requires integer representation."),
            "Bucket Sort": (analysis["is_numeric"], "Requires numeric values for interval distribution.")
        }
        for name, (is_s, reason) in algos.items():
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})
    elif task_type == "searching":
        is_sorted = analysis["is_sorted"]
        algos = {
            "Linear Search": (True, ""),
            "Binary Search": (is_sorted, "Requires a pre-sorted array for divide-and-conquer logic."),
            "Jump Search": (is_sorted, "Block jumping requires elements to be in ascending order."),
            "Fibonacci Search": (is_sorted, "Fibonacci interval reduction requires a sorted state."),
            "Exponential Search": (is_sorted, "Range-finding requires sorted elements."),
            "Interpolation Search": (is_sorted and analysis["is_numeric"], "Requires sorted numeric values for mathematical position estimation.")
        }
        for name, (is_s, reason) in algos.items():
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})
    return {"suitable": suitable, "unsuitable": unsuitable}
