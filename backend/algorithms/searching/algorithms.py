import time
import math

def linear_search(arr, target):
    start_time = time.time()
    comparisons = 0
    for i in range(len(arr)):
        comparisons += 1
        if arr[i] == target:
            end_time = time.time()
            return i, (end_time - start_time) * 1000, comparisons
    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons

def binary_search(arr, target):
    start_time = time.time()
    comparisons = 0
    low = 0
    high = len(arr) - 1
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            end_time = time.time()
            return mid, (end_time - start_time) * 1000, comparisons
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons

def jump_search(arr, target):
    start_time = time.time()
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    comparisons = 0

    if n == 0: return -1, 0, 0

    while arr[min(step, n) - 1] < target:
        comparisons += 1
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            end_time = time.time()
            return -1, (end_time - start_time) * 1000, comparisons
    comparisons += 1

    while arr[prev] < target:
        comparisons += 1
        prev += 1
        if prev == min(step, n):
            end_time = time.time()
            return -1, (end_time - start_time) * 1000, comparisons
    comparisons += 1

    if arr[prev] == target:
        end_time = time.time()
        return prev, (end_time - start_time) * 1000, comparisons

    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons

def interpolation_search(arr, target):
    start_time = time.time()
    low = 0
    high = len(arr) - 1
    comparisons = 0

    while low <= high and target >= arr[low] and target <= arr[high]:
        comparisons += 1
        if low == high:
            if arr[low] == target:
                end_time = time.time()
                return low, (end_time - start_time) * 1000, comparisons
            break

        pos = low + int(((float(high - low) / (arr[high] - arr[low])) * (target - arr[low])))

        if arr[pos] == target:
            end_time = time.time()
            return pos, (end_time - start_time) * 1000, comparisons

        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1

    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons

def exponential_search(arr, target):
    start_time = time.time()
    n = len(arr)
    comparisons = 0
    if n == 0: return -1, 0, 0
    if arr[0] == target:
        comparisons += 1
        end_time = time.time()
        return 0, (end_time - start_time) * 1000, comparisons
    comparisons += 1

    i = 1
    while i < n and arr[i] <= target:
        comparisons += 1
        i = i * 2

    # Binary search in the range
    low = i // 2
    high = min(i, n - 1)
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            end_time = time.time()
            return mid, (end_time - start_time) * 1000, comparisons
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons

def fibonacci_search(arr, target):
    start_time = time.time()
    n = len(arr)
    fib_m_minus_2 = 0
    fib_m_minus_1 = 1
    fib_m = fib_m_minus_1 + fib_m_minus_2
    comparisons = 0

    while fib_m < n:
        fib_m_minus_2 = fib_m_minus_1
        fib_m_minus_1 = fib_m
        fib_m = fib_m_minus_1 + fib_m_minus_2

    offset = -1

    while fib_m > 1:
        i = min(offset + fib_m_minus_2, n - 1)
        comparisons += 1
        if arr[i] < target:
            fib_m = fib_m_minus_1
            fib_m_minus_1 = fib_m_minus_2
            fib_m_minus_2 = fib_m - fib_m_minus_1
            offset = i
        elif arr[i] > target:
            fib_m = fib_m_minus_2
            fib_m_minus_1 = fib_m_minus_1 - fib_m_minus_2
            fib_m_minus_2 = fib_m - fib_m_minus_1
        else:
            end_time = time.time()
            return i, (end_time - start_time) * 1000, comparisons

    if fib_m_minus_1 and offset + 1 < n and arr[offset + 1] == target:
        comparisons += 1
        end_time = time.time()
        return offset + 1, (end_time - start_time) * 1000, comparisons

    end_time = time.time()
    return -1, (end_time - start_time) * 1000, comparisons
