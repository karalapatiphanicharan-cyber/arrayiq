export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ALGORITHMS = {
  SORTING: [
    'bubble_sort',
    'selection_sort',
    'insertion_sort',
    'merge_sort',
    'quick_sort',
    'heap_sort',
    'shell_sort',
    'counting_sort',
    'radix_sort',
    'bucket_sort',
    'tim_sort'
  ],
  SEARCHING: [
    'linear_search',
    'binary_search',
    'jump_search',
    'interpolation_search',
    'exponential_search',
    'fibonacci_search'
  ],
  QUANTUM: [
    'grovers',
    'amplitude_amplification',
    'quantum_walk',
    'quantum_bitonic'
  ]
};
