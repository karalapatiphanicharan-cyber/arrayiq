def validate_algorithm(algorithm_name, arr, target=None):
    errors = []

    sorted_required = ["binary_search", "jump_search", "interpolation_search", "exponential_search", "fibonacci_search"]
    numeric_required = ["interpolation_search", "counting_sort", "radix_sort", "bucket_sort"]
    integer_required = ["counting_sort", "radix_sort"]

    if algorithm_name in sorted_required:
        if arr != sorted(arr):
            errors.append(f"{algorithm_name.replace('_', ' ').title()} requires a sorted array.")

    if algorithm_name in numeric_required:
        if not all(isinstance(x, (int, float)) for x in arr):
            errors.append(f"{algorithm_name.replace('_', ' ').title()} requires numeric values.")

    if algorithm_name in integer_required:
        if not all(isinstance(x, int) for x in arr):
            errors.append(f"{algorithm_name.replace('_', ' ').title()} requires integer values.")

    if len(arr) > 5000 and algorithm_name in ["bubble_sort", "selection_sort"]:
        errors.append(f"{algorithm_name.replace('_', ' ').title()} is not recommended for large datasets (>5000 elements).")

    return errors
