import time
from typing import List, Tuple, Dict, Any

def bubble_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.perf_counter()

    arr_copy = list(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            comparisons += 1
            if arr_copy[j] > arr_copy[j + 1]:
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swaps += 1

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def selection_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.perf_counter()

    arr_copy = list(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if arr_copy[min_idx] > arr_copy[j]:
                min_idx = j
        if min_idx != i:
            arr_copy[i], arr_copy[min_idx] = arr_copy[min_idx], arr_copy[i]
            swaps += 1

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def insertion_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.perf_counter()

    arr_copy = list(arr)
    for i in range(1, n):
        key = arr_copy[i]
        j = i - 1
        while j >= 0:
            comparisons += 1
            if arr_copy[j] > key:
                arr_copy[j + 1] = arr_copy[j]
                swaps += 1
                j -= 1
            else:
                break
        arr_copy[j + 1] = key

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def merge_sort_wrapper(arr: List[int]) -> Tuple[List[int], float, int, int]:
    metrics = {"comparisons": 0, "swaps": 0}

    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        return merge(left, right)

    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            metrics["comparisons"] += 1
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
            metrics["swaps"] += 1

        result.extend(left[i:])
        result.extend(right[j:])
        metrics["swaps"] += (len(left) - i + len(right) - j)
        return result

    start_time = time.perf_counter()
    sorted_arr = merge_sort(list(arr))
    end_time = time.perf_counter()
    return sorted_arr, (end_time - start_time) * 1000, metrics["comparisons"], metrics["swaps"]

def quick_sort_wrapper(arr: List[int]) -> Tuple[List[int], float, int, int]:
    metrics = {"comparisons": 0, "swaps": 0}

    def quick_sort(arr, low, high):
        if low < high:
            pi = partition(arr, low, high)
            quick_sort(arr, low, pi - 1)
            quick_sort(arr, pi + 1, high)

    def partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            metrics["comparisons"] += 1
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                metrics["swaps"] += 1
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        metrics["swaps"] += 1
        return i + 1

    start_time = time.perf_counter()
    arr_copy = list(arr)
    quick_sort(arr_copy, 0, len(arr_copy) - 1)
    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, metrics["comparisons"], metrics["swaps"]

def heap_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    metrics = {"comparisons": 0, "swaps": 0}

    def heapify(arr, n, i):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2

        if l < n:
            metrics["comparisons"] += 1
            if arr[l] > arr[largest]:
                largest = l

        if r < n:
            metrics["comparisons"] += 1
            if arr[r] > arr[largest]:
                largest = r

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            metrics["swaps"] += 1
            heapify(arr, n, largest)

    start_time = time.perf_counter()
    arr_copy = list(arr)
    n = len(arr_copy)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr_copy, n, i)

    for i in range(n - 1, 0, -1):
        arr_copy[i], arr_copy[0] = arr_copy[0], arr_copy[i]
        metrics["swaps"] += 1
        heapify(arr_copy, i, 0)

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, metrics["comparisons"], metrics["swaps"]

def shell_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    n = len(arr)
    gap = n // 2
    comparisons = 0
    swaps = 0
    start_time = time.perf_counter()

    arr_copy = list(arr)
    while gap > 0:
        for i in range(gap, n):
            temp = arr_copy[i]
            j = i
            while j >= gap:
                comparisons += 1
                if arr_copy[j - gap] > temp:
                    arr_copy[j] = arr_copy[j - gap]
                    swaps += 1
                    j -= gap
                else:
                    break
            arr_copy[j] = temp
        gap //= 2

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def counting_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    if not arr: return arr, 0, 0, 0
    start_time = time.perf_counter()
    max_val = int(max(arr))
    min_val = int(min(arr))
    range_val = max_val - min_val + 1
    count = [0] * range_val
    output = [0] * len(arr)
    swaps = 0

    for i in range(len(arr)):
        count[int(arr[i]) - min_val] += 1

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    for i in range(len(arr) - 1, -1, -1):
        output[count[int(arr[i]) - min_val] - 1] = arr[i]
        count[int(arr[i]) - min_val] -= 1
        swaps += 1

    end_time = time.perf_counter()
    return output, (end_time - start_time) * 1000, 0, swaps

def radix_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    if not arr: return arr, 0, 0, 0
    start_time = time.perf_counter()
    arr_copy = [int(x) for x in arr]
    max_val = max(arr_copy)
    exp = 1
    swaps = 0

    while max_val // exp > 0:
        n = len(arr_copy)
        output = [0] * n
        count = [0] * 10
        for i in range(n):
            index = (arr_copy[i] // exp)
            count[index % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        i = n - 1
        while i >= 0:
            index = (arr_copy[i] // exp)
            output[count[index % 10] - 1] = arr_copy[i]
            count[index % 10] -= 1
            i -= 1
            swaps += 1
        for i in range(len(arr_copy)):
            arr_copy[i] = output[i]
        exp *= 10

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, 0, swaps

def bucket_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    if not arr: return arr, 0, 0, 0
    start_time = time.perf_counter()
    arr_copy = list(arr)
    num_buckets = 10
    max_v, min_v = max(arr_copy), min(arr_copy)
    bucket_range = (max_v - min_v) / num_buckets or 1
    buckets = [[] for _ in range(num_buckets + 1)]
    for x in arr_copy: buckets[int((x - min_v) / bucket_range)].append(x)

    comparisons = 0
    swaps = 0
    k = 0
    for i in range(len(buckets)):
        bucket = buckets[i]
        for b_i in range(1, len(bucket)):
            key = bucket[b_i]
            b_j = b_i - 1
            while b_j >= 0:
                comparisons += 1
                if bucket[b_j] > key:
                    bucket[b_j + 1] = bucket[b_j]
                    swaps += 1
                    b_j -= 1
                else: break
            bucket[b_j + 1] = key
        for val in bucket:
            arr_copy[k] = val
            k += 1
            swaps += 1

    end_time = time.perf_counter()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def tim_sort(arr: List[int]) -> Tuple[List[int], float, int, int]:
    start_time = time.perf_counter()
    arr_copy = list(arr)
    arr_copy.sort()
    end_time = time.perf_counter()
    n = len(arr)
    import math
    comparisons = int(n * math.log2(n)) if n > 0 else 0
    return arr_copy, (end_time - start_time) * 1000, comparisons, comparisons
