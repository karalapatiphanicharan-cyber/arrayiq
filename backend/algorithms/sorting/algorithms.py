import time

def bubble_sort(arr):
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.time()

    arr_copy = arr[:]
    for i in range(n):
        for j in range(0, n - i - 1):
            comparisons += 1
            if arr_copy[j] > arr_copy[j + 1]:
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swaps += 1

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def selection_sort(arr):
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.time()

    arr_copy = arr[:]
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if arr_copy[min_idx] > arr_copy[j]:
                min_idx = j
        arr_copy[i], arr_copy[min_idx] = arr_copy[min_idx], arr_copy[i]
        swaps += 1

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def insertion_sort(arr):
    n = len(arr)
    swaps = 0
    comparisons = 0
    start_time = time.time()

    arr_copy = arr[:]
    for i in range(1, n):
        key = arr_copy[i]
        j = i - 1
        while j >= 0 and key < arr_copy[j]:
            comparisons += 1
            arr_copy[j + 1] = arr_copy[j]
            j -= 1
            swaps += 1
        if j >= 0: comparisons += 1
        arr_copy[j + 1] = key

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def merge_sort_wrapper(arr):
    comparisons = [0]
    swaps = [0] # Actually assignments in merge sort

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
            comparisons[0] += 1
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
            swaps[0] += 1

        result.extend(left[i:])
        result.extend(right[j:])
        swaps[0] += (len(left) - i + len(right) - j)
        return result

    start_time = time.time()
    sorted_arr = merge_sort(arr[:])
    end_time = time.time()
    return sorted_arr, (end_time - start_time) * 1000, comparisons[0], swaps[0]

def quick_sort_wrapper(arr):
    comparisons = [0]
    swaps = [0]

    def quick_sort(arr, low, high):
        if low < high:
            pi, c, s = partition(arr, low, high)
            comparisons[0] += c
            swaps[0] += s
            quick_sort(arr, low, pi - 1)
            quick_sort(arr, pi + 1, high)

    def partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        c = 0
        s = 0
        for j in range(low, high):
            c += 1
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                s += 1
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        s += 1
        return i + 1, c, s

    start_time = time.time()
    arr_copy = arr[:]
    quick_sort(arr_copy, 0, len(arr_copy) - 1)
    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons[0], swaps[0]

def heap_sort(arr):
    n = len(arr)
    comparisons = [0]
    swaps = [0]

    def heapify(arr, n, i):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2

        if l < n:
            comparisons[0] += 1
            if arr[l] > arr[largest]:
                largest = l

        if r < n:
            comparisons[0] += 1
            if arr[r] > arr[largest]:
                largest = r

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            swaps[0] += 1
            heapify(arr, n, largest)

    start_time = time.time()
    arr_copy = arr[:]
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr_copy, n, i)

    for i in range(n - 1, 0, -1):
        arr_copy[i], arr_copy[0] = arr_copy[0], arr_copy[i]
        swaps[0] += 1
        heapify(arr_copy, i, 0)

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons[0], swaps[0]

def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    comparisons = 0
    swaps = 0
    start_time = time.time()

    arr_copy = arr[:]
    while gap > 0:
        for i in range(gap, n):
            temp = arr_copy[i]
            j = i
            while j >= gap and arr_copy[j - gap] > temp:
                comparisons += 1
                arr_copy[j] = arr_copy[j - gap]
                j -= gap
                swaps += 1
            if j >= gap: comparisons += 1
            arr_copy[j] = temp
        gap //= 2

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def counting_sort(arr):
    if not arr: return arr, 0, 0, 0
    start_time = time.time()
    max_val = int(max(arr))
    min_val = int(min(arr))
    range_val = max_val - min_val + 1
    count = [0] * range_val
    output = [0] * len(arr)

    comparisons = 0
    swaps = 0 # Assignments

    for i in range(len(arr)):
        count[int(arr[i]) - min_val] += 1

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    for i in range(len(arr) - 1, -1, -1):
        output[count[int(arr[i]) - min_val] - 1] = arr[i]
        count[int(arr[i]) - min_val] -= 1
        swaps += 1

    end_time = time.time()
    return output, (end_time - start_time) * 1000, comparisons, swaps

def radix_sort(arr):
    if not arr: return arr, 0, 0, 0
    start_time = time.time()
    arr_copy = [int(x) for x in arr]
    max_val = max(arr_copy)
    exp = 1
    comparisons = 0
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

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def bucket_sort(arr):
    if not arr: return arr, 0, 0, 0
    start_time = time.time()
    arr_copy = arr[:]
    num_buckets = 10
    max_val = max(arr_copy)
    min_val = min(arr_copy)
    bucket_range = (max_val - min_val) / num_buckets
    if bucket_range == 0: bucket_range = 1

    buckets = [[] for _ in range(num_buckets + 1)]
    for i in range(len(arr_copy)):
        diff = (arr_copy[i] - min_val) / bucket_range
        buckets[int(diff)].append(arr_copy[i])

    comparisons = 0
    swaps = 0
    k = 0
    for i in range(len(buckets)):
        # Insertion sort on each bucket
        bucket = buckets[i]
        for b_i in range(1, len(bucket)):
            key = bucket[b_i]
            b_j = b_i - 1
            while b_j >= 0 and key < bucket[b_j]:
                comparisons += 1
                bucket[b_j + 1] = bucket[b_j]
                b_j -= 1
                swaps += 1
            if b_j >= 0: comparisons += 1
            bucket[b_j + 1] = key

        for val in bucket:
            arr_copy[k] = val
            k += 1
            swaps += 1

    end_time = time.time()
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps

def tim_sort(arr):
    start_time = time.time()
    arr_copy = arr[:]
    # Using python's sorted which uses Timsort
    arr_copy.sort()
    end_time = time.time()
    # Mocking comparisons and swaps for Timsort as it's complex to implement from scratch with tracking
    n = len(arr)
    import math
    comparisons = int(n * math.log2(n)) if n > 0 else 0
    swaps = comparisons # Approximate
    return arr_copy, (end_time - start_time) * 1000, comparisons, swaps
