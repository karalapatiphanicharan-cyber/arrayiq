import numpy as np
import statistics
import math
from typing import List, Dict, Any

def calculate_entropy(arr: List[Any]) -> float:
    if not arr: return 0.0
    n = len(arr)
    from collections import Counter
    counts = Counter(arr)
    entropy = 0.0
    for count in counts.values():
        p = count / n
        entropy -= p * math.log2(p)
    return entropy

def calculate_sortedness(arr: List[Any]) -> float:
    n = len(arr)
    if n <= 1: return 1.0
    in_order = sum(1 for i in range(n-1) if arr[i] <= arr[i+1])
    return in_order / (n-1)

def analyze_array(arr: List[Any]) -> Dict[str, Any]:
    if not arr:
        return {
            "size": 0, "is_sorted": False, "duplicates": 0, "duplicate_ratio": 0.0,
            "is_numeric": False, "entropy": 0.0, "sortedness": 0.0
        }

    n = len(arr)
    is_numeric = all(isinstance(x, (int, float)) for x in arr)
    is_integer = all(isinstance(x, int) for x in arr)

    sortedness = calculate_sortedness(arr)
    is_sorted = sortedness == 1.0
    unique_count = len(set(arr))
    duplicates = n - unique_count
    duplicate_ratio = duplicates / n
    entropy = calculate_entropy(arr)

    analysis = {
        "size": n,
        "is_sorted": is_sorted,
        "sortedness": sortedness,
        "duplicates": duplicates,
        "duplicate_ratio": duplicate_ratio,
        "entropy": entropy,
        "is_numeric": is_numeric,
        "is_integer": is_integer,
    }

    if is_numeric and n > 0:
        arr_numeric = [float(x) for x in arr]
        analysis.update({
            "min": min(arr_numeric),
            "max": max(arr_numeric),
            "sum": sum(arr_numeric),
            "avg": sum(arr_numeric) / n,
            "range": max(arr_numeric) - min(arr_numeric),
            "nearly_sorted": sortedness > 0.85,
            "is_uniform": is_uniformly_distributed(arr_numeric) if is_sorted else False,
            "has_negative": any(x < 0 for x in arr_numeric),
            "stdev": statistics.stdev(arr_numeric) if n > 1 else 0.0,
            "median": statistics.median(arr_numeric),
            "variance": statistics.variance(arr_numeric) if n > 1 else 0.0
        })
    return analysis

def is_uniformly_distributed(arr: List[float]) -> bool:
    n = len(arr)
    if n < 5: return False
    diffs = [arr[i+1] - arr[i] for i in range(n-1)]
    avg_diff = sum(diffs) / len(diffs)
    if avg_diff == 0: return True
    std_diff = statistics.stdev(diffs) if len(diffs) > 1 else 0
    return (std_diff / (avg_diff + 1e-9)) < 0.2

def get_sorting_recommendation(arr: List[Any]) -> List[Dict[str, Any]]:
    analysis = analyze_array(arr)
    if not arr: return []

    candidates = []
    n = analysis["size"]
    s = analysis["sortedness"]
    dr = analysis["duplicate_ratio"]
    en = analysis["entropy"]
    rng = analysis.get("range", 0)
    is_int = analysis["is_integer"]
    has_neg = analysis.get("has_negative", False)

    # Scoring Logic
    # 1. Quick Sort
    qs_score = 85
    if s < 0.5: qs_score += 10
    if n > 1000: qs_score += 5
    if dr > 0.5: qs_score -= 15
    candidates.append({
        "name": "Quick Sort",
        "score": min(qs_score, 98),
        "reason": f"Effective for {n} elements with low sortedness ({s:.2f}). Highly cache-efficient for random distributions."
    })

    # 2. Merge Sort
    ms_score = 80
    if n > 5000: ms_score += 10
    if dr > 0.4: ms_score += 5
    candidates.append({
        "name": "Merge Sort",
        "score": min(ms_score, 95),
        "reason": "Stable O(n log n) performance. Preferred for large datasets or when stability is required."
    })

    # 3. Tim Sort
    ts_score = 70
    if s > 0.7: ts_score += 25
    if n > 100: ts_score += 5
    candidates.append({
        "name": "Tim Sort",
        "score": min(ts_score, 99),
        "reason": f"Excellent for nearly sorted data (Score: {s:.2f}). Leverages existing runs in your dataset."
    })

    # 4. Insertion Sort
    ins_score = 30
    if s > 0.9: ins_score += 65
    if n < 50: ins_score += 20
    candidates.append({
        "name": "Insertion Sort",
        "score": min(ins_score, 98),
        "reason": "Top performer for small or highly ordered arrays. Minimum overhead for the current distribution."
    })

    # 5. Counting Sort
    cs_score = 10
    if is_int and not has_neg and rng < n * 5:
        cs_score = 90 + (10 if rng < n else 0)
    candidates.append({
        "name": "Counting Sort",
        "score": min(cs_score, 99),
        "reason": "Linear time complexity O(n+k) is achievable since range is small relative to size."
    })

    sorted_recs = sorted(candidates, key=lambda x: x["score"], reverse=True)

    return [
        {
            "name": r["name"],
            "confidence": r["score"],
            "reason": r["reason"],
            "rank": i + 1,
            "type": "Primary" if i == 0 else ("Secondary" if i == 1 else "Alternative")
        }
        for i, r in enumerate(sorted_recs[:3])
    ]

def get_searching_recommendation(arr: List[Any]) -> List[Dict[str, Any]]:
    analysis = analyze_array(arr)
    if not arr: return []

    n = analysis["size"]
    is_sorted = analysis["is_sorted"]
    is_uniform = analysis.get("is_uniform", False)

    recs = []
    if not is_sorted:
        recs.append({
            "name": "Linear Search",
            "confidence": 100,
            "reason": "Array is unstructured. Sequential O(n) scan is mandatory for guaranteed discovery.",
            "rank": 1, "type": "Primary"
        })
        recs.append({
            "name": "Quick Sort + Binary Search",
            "confidence": 75,
            "reason": "For multiple lookups, consider one-time O(n log n) sort followed by O(log n) searches.",
            "rank": 2, "type": "Secondary"
        })
    else:
        if is_uniform:
            recs.append({
                "name": "Interpolation Search",
                "confidence": 98,
                "reason": "Uniform distribution detected. Performance approaches O(log log n) by calculating likely position.",
                "rank": 1, "type": "Primary"
            })
            recs.append({
                "name": "Binary Search",
                "confidence": 95,
                "reason": "Highly robust fallback for sorted data with O(log n) guarantees.",
                "rank": 2, "type": "Secondary"
            })
        else:
            recs.append({
                "name": "Binary Search",
                "confidence": 99,
                "reason": "Sorted distribution. Logarithmic time complexity is optimal for general sorted search.",
                "rank": 1, "type": "Primary"
            })
            recs.append({
                "name": "Fibonacci Search",
                "confidence": 85,
                "reason": "Division-less search using golden ratio. Efficient on hardware with slow division.",
                "rank": 2, "type": "Secondary"
            })

    return recs[:3]

def get_suitability(arr: List[Any], task_type: str = "sorting") -> Dict[str, Any]:
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
            ("Bubble Sort", size < 2000, f"Quadratic O(n²) scaling is non-viable for {size} elements. Expected latency > 2s."),
            ("Selection Sort", size < 2000, f"O(n²) bottleneck makes this inefficient for large datasets."),
            ("Counting Sort", analysis["is_integer"] and not analysis.get("has_negative"), "Requires non-negative integers for index-based frequency mapping."),
            ("Radix Sort", analysis["is_integer"] and not analysis.get("has_negative"), "Requires positive integer representation for digit-by-digit distribution."),
            ("Bucket Sort", analysis["is_numeric"], "Requires numeric values for interval partitioning.")
        ]
        for name, is_s, reason in configs:
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})

    elif task_type == "searching":
        is_sorted = analysis.get("is_sorted", False)
        configs = [
            ("Linear Search", True, ""),
            ("Binary Search", is_sorted, "Binary search requires sorted data to perform interval bisection."),
            ("Jump Search", is_sorted, "Requires sorted indices to perform block-based leaping."),
            ("Fibonacci Search", is_sorted, "Requires sorted data for Fibonacci-based range reduction."),
            ("Exponential Search", is_sorted, "Requires sorted data for range identification."),
            ("Interpolation Search", is_sorted and analysis.get("is_numeric"), "Requires sorted numeric data for linear interpolation of target position.")
        ]
        for name, is_s, reason in configs:
            if is_s: suitable.append({"name": name})
            else: unsuitable.append({"name": name, "reason": reason})

    return {"suitable": suitable, "unsuitable": unsuitable}
