import numpy as np

def analyze_array(arr):
    if not arr:
        return {}

    n = len(arr)
    is_numeric = all(isinstance(x, (int, float)) for x in arr)

    analysis = {
        "size": n,
        "is_sorted": arr == sorted(arr),
        "duplicates": len(arr) - len(set(arr)),
        "is_numeric": is_numeric
    }

    if is_numeric:
        analysis.update({
            "min": min(arr),
            "max": max(arr),
            "avg": sum(arr) / n,
            "nearly_sorted": is_nearly_sorted(arr)
        })

    return analysis

def is_nearly_sorted(arr):
    if len(arr) <= 1: return True
    # If more than 80% of elements are in correct relative order
    in_order = 0
    for i in range(len(arr) - 1):
        if arr[i] <= arr[i+1]:
            in_order += 1
    return (in_order / (len(arr) - 1)) > 0.8

def get_recommendations(arr, task_type="sorting"):
    analysis = analyze_array(arr)
    recs = []

    if task_type == "sorting":
        if analysis["is_sorted"]:
            recs.append({"name": "Insertion Sort", "confidence": 95, "reason": "Array is already sorted or nearly sorted."})
        elif analysis["size"] < 50:
            recs.append({"name": "Insertion Sort", "confidence": 90, "reason": "Small dataset, insertion sort is very efficient."})
        elif analysis.get("nearly_sorted"):
            recs.append({"name": "Insertion Sort", "confidence": 85, "reason": "Nearly sorted arrays are handled efficiently."})
        elif analysis["is_numeric"] and (analysis["max"] - analysis["min"]) < analysis["size"] * 2:
            recs.append({"name": "Counting Sort", "confidence": 80, "reason": "Small integer range detected."})
        else:
            recs.append({"name": "Quick Sort", "confidence": 94, "reason": "General purpose large random dataset."})
            recs.append({"name": "Merge Sort", "confidence": 90, "reason": "Stable sort needed or worst-case performance is a concern."})

    elif task_type == "searching":
        if analysis["is_sorted"]:
            recs.append({"name": "Binary Search", "confidence": 98, "reason": "Array is sorted, O(log n) performance."})
            if analysis["is_numeric"]:
                recs.append({"name": "Interpolation Search", "confidence": 85, "reason": "Sorted numeric array with uniform distribution."})
        else:
            recs.append({"name": "Linear Search", "confidence": 100, "reason": "Array is unsorted, linear search is required."})

    return recs
