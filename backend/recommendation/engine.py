import numpy as np

def analyze_array(arr):
    if not arr:
        return {}

    n = len(arr)
    is_numeric = all(isinstance(x, (int, float)) for x in arr)
    is_integer = all(isinstance(x, int) for x in arr)

    sorted_arr = sorted(arr)
    is_sorted = arr == sorted_arr

    analysis = {
        "size": n,
        "is_sorted": is_sorted,
        "duplicates": len(arr) - len(set(arr)),
        "is_numeric": is_numeric,
        "is_integer": is_integer,
    }

    if is_numeric and n > 0:
        analysis.update({
            "min": min(arr),
            "max": max(arr),
            "avg": sum(arr) / n,
            "nearly_sorted": is_nearly_sorted(arr),
            "is_uniform": is_uniformly_distributed(arr) if is_sorted else False
        })

    return analysis

def is_nearly_sorted(arr):
    if len(arr) <= 1: return True
    in_order = 0
    for i in range(len(arr) - 1):
        if arr[i] <= arr[i+1]:
            in_order += 1
    return (in_order / (len(arr) - 1)) > 0.8

def is_uniformly_distributed(arr):
    if len(arr) < 10: return False
    # Check if differences between consecutive elements are similar
    diffs = [arr[i+1] - arr[i] for i in range(len(arr)-1)]
    std_dev = np.std(diffs)
    mean_diff = np.mean(diffs)
    if mean_diff == 0: return True
    return (std_dev / mean_diff) < 0.2

def get_sorting_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []

    recs = []
    size = analysis["size"]

    if analysis.get("nearly_sorted"):
        recs.append({"name": "Insertion Sort", "confidence": 95, "reason": "Array is nearly sorted. Insertion Sort has O(n) performance in this case."})
    elif analysis["is_numeric"] and analysis["is_integer"] and (analysis["max"] - analysis["min"]) < size * 2:
        recs.append({"name": "Counting Sort", "confidence": 92, "reason": "Small integer range detected. Counting Sort provides O(n+k) efficiency."})
    elif size > 1000 and analysis["is_integer"]:
        recs.append({"name": "Radix Sort", "confidence": 88, "reason": "Large integer dataset. Radix Sort is efficient for large-scale integer sorting."})
    elif size > 500:
        recs.append({"name": "Quick Sort", "confidence": 94, "reason": "Large random distribution. Quick Sort is generally the fastest for this scenario."})
    else:
        recs.append({"name": "Tim Sort", "confidence": 90, "reason": "General purpose dataset. Tim Sort is highly optimized for various real-world data distributions."})

    # Always add a secondary recommendation if available
    if "Merge Sort" not in [r["name"] for r in recs]:
        recs.append({"name": "Merge Sort", "confidence": 85, "reason": "Guaranteed O(n log n) performance and stable sorting."})

    return recs

def get_searching_recommendation(arr):
    analysis = analyze_array(arr)
    if not arr: return []

    recs = []
    is_sorted = analysis["is_sorted"]
    size = analysis["size"]

    if not is_sorted:
        recs.append({"name": "Linear Search", "confidence": 100, "reason": "Array is unsorted. Linear search is the only viable option without pre-sorting."})
    else:
        if analysis.get("is_uniform"):
            recs.append({"name": "Interpolation Search", "confidence": 95, "reason": "Sorted numeric array with uniform distribution. O(log log n) performance."})
        elif size > 1000:
            recs.append({"name": "Jump Search", "confidence": 90, "reason": "Large sorted dataset. Jump search reduces the number of comparisons by jumping ahead."})
        else:
            recs.append({"name": "Binary Search", "confidence": 98, "reason": "Sorted array detected. Binary search provides optimal O(log n) performance."})

    return recs

def get_suitability(arr, task_type="sorting"):
    analysis = analyze_array(arr)
    if not arr: return {"suitable": [], "unsuitable": []}

    suitable = []
    unsuitable = []

    if task_type == "sorting":
        all_algos = ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Shell Sort", "Counting Sort", "Radix Sort", "Bucket Sort", "Tim Sort"]

        for name in all_algos:
            is_s = True
            reason = ""

            if analysis["size"] > 5000 and name in ["Bubble Sort", "Selection Sort"]:
                is_s = False
                reason = "Dataset too large. Quadratic complexity will lead to poor performance."
            elif analysis.get("nearly_sorted") and name in ["Bubble Sort", "Selection Sort"]:
                is_s = False
                reason = "Not ideal for nearly sorted data. Efficient alternatives like Insertion Sort exist."
            elif name == "Counting Sort" and not analysis["is_integer"]:
                is_s = False
                reason = "Requires integer values."
            elif name == "Radix Sort" and not analysis["is_integer"]:
                is_s = False
                reason = "Requires integer values."
            elif name == "Bucket Sort" and not analysis["is_numeric"]:
                is_s = False
                reason = "Requires numeric values."

            if is_s:
                suitable.append({"name": name})
            else:
                unsuitable.append({"name": name, "reason": reason})

    elif task_type == "searching":
        all_algos = ["Linear Search", "Binary Search", "Jump Search", "Interpolation Search", "Exponential Search", "Fibonacci Search"]
        is_sorted = analysis["is_sorted"]

        for name in all_algos:
            is_s = True
            reason = ""

            if name != "Linear Search" and not is_sorted:
                is_s = False
                reason = "Requires a sorted array."
            elif name == "Interpolation Search" and not analysis["is_numeric"]:
                is_s = False
                reason = "Requires numeric values."

            if is_s:
                suitable.append({"name": name})
            else:
                unsuitable.append({"name": name, "reason": reason})

    return {"suitable": suitable, "unsuitable": unsuitable}
