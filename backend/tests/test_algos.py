from backend.algorithms.sorting.algorithms import bubble_sort, quick_sort_wrapper
from backend.algorithms.searching.algorithms import binary_search, linear_search

def test_sorting():
    arr = [5, 2, 9, 1, 5, 6]
    sorted_arr, _, _, _ = bubble_sort(arr)
    assert sorted_arr == sorted(arr)

    sorted_arr, _, _, _ = quick_sort_wrapper(arr)
    assert sorted_arr == sorted(arr)

def test_searching():
    arr = [1, 2, 5, 5, 6, 9]
    idx, _, _ = binary_search(arr, 5)
    assert arr[idx] == 5

    idx, _, _ = linear_search(arr, 10)
    assert idx == -1
