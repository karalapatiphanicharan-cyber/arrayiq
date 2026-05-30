import time
import math

def linear_search(arr, target):
    start_time = time.perf_counter()
    comparisons = 0
    for i in range(len(arr)):
        comparisons += 1
        if arr[i] == target:
            end_time = time.perf_counter()
            return i, (end_time - start_time) * 1000, comparisons
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons

def binary_search(arr, target):
    start_time = time.perf_counter()
    comparisons = 0
    low, high = 0, len(arr) - 1
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            end_time = time.perf_counter()
            return mid, (end_time - start_time) * 1000, comparisons
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons

def jump_search(arr, target):
    start_time = time.perf_counter()
    n = len(arr)
    if n == 0: return -1, 0, 0
    step = int(math.sqrt(n))
    prev = 0
    comparisons = 0
    while arr[min(step, n) - 1] < target:
        comparisons += 1
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            end_time = time.perf_counter()
            return -1, (end_time - start_time) * 1000, comparisons
    comparisons += 1
    while arr[prev] < target:
        comparisons += 1
        prev += 1
        if prev == min(step, n):
            end_time = time.perf_counter()
            return -1, (end_time - start_time) * 1000, comparisons
    comparisons += 1
    if arr[prev] == target:
        end_time = time.perf_counter()
        return prev, (end_time - start_time) * 1000, comparisons
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons

def interpolation_search(arr, target):
    start_time = time.perf_counter()
    low, high, comparisons = 0, len(arr) - 1, 0
    while low <= high and target >= arr[low] and target <= arr[high]:
        comparisons += 1
        if low == high:
            if arr[low] == target:
                end_time = time.perf_counter()
                return low, (end_time - start_time) * 1000, comparisons
            break
        pos = low + int(((float(high - low) / (arr[high] - arr[low])) * (target - arr[low])))
        if arr[pos] == target:
            end_time = time.perf_counter()
            return pos, (end_time - start_time) * 1000, comparisons
        if arr[pos] < target: low = pos + 1
        else: high = pos - 1
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons

def exponential_search(arr, target):
    start_time = time.perf_counter()
    n = len(arr)
    if n == 0: return -1, 0, 0
    comparisons = 0
    if arr[0] == target:
        comparisons += 1
        end_time = time.perf_counter()
        return 0, (end_time - start_time) * 1000, comparisons
    comparisons += 1
    i = 1
    while i < n and arr[i] <= target:
        comparisons += 1
        i = i * 2
    low, high = i // 2, min(i, n - 1)
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            end_time = time.perf_counter()
            return mid, (end_time - start_time) * 1000, comparisons
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons

def fibonacci_search(arr, target):
    start_time = time.perf_counter()
    n = len(arr)
    f2, f1 = 0, 1
    fm = f2 + f1
    comparisons = 0
    while fm < n:
        f2, f1 = f1, fm
        fm = f2 + f1
    offset = -1
    while fm > 1:
        i = min(offset + f2, n - 1)
        comparisons += 1
        if arr[i] < target: fm, f1, f2, offset = f1, f2, fm - f1, i
        elif arr[i] > target: fm, f1, f2 = f2, f1 - f2, fm - f1
        else:
            end_time = time.perf_counter()
            return i, (end_time - start_time) * 1000, comparisons
    if f1 and offset + 1 < n and arr[offset + 1] == target:
        comparisons += 1
        end_time = time.perf_counter()
        return offset + 1, (end_time - start_time) * 1000, comparisons
    end_time = time.perf_counter()
    return -1, (end_time - start_time) * 1000, comparisons
