# ArrayIQ Benchmarking Documentation

## Overview
ArrayIQ uses a hardware-level telemetry engine to provide high-precision performance metrics for sorting and searching algorithms.

## Telemetry Engine
The engine utilizes Python's `time.perf_counter()` for nanosecond-precision timing and `tracemalloc` for peak memory floor detection.

### Methodology
1. **Warmup Phase**: A single execution is performed to stabilize CPU frequency and cache states.
2. **Precision Averaging**: Algorithms are executed over 3-5 iterations. The total duration is averaged to eliminate jitter.
3. **Memory Floor**: The peak memory usage is recorded during the first execution to capture the maximum space requirement.

## Metric Definitions
- **Runtime**: The wall-clock time spent executing the core algorithm logic (expressed in milliseconds).
- **Comparisons**: The exact count of element-to-element comparisons performed.
- **Swaps**: The count of element position exchanges (sorting only).
- **Memory**: The peak resident set size delta during execution (expressed in MB).

## Large Dataset Protection
Algorithms with $O(n^2)$ complexity (Bubble Sort, Selection Sort) are automatically disabled for datasets larger than 5,000 elements to prevent browser hangs and provide a realistic SaaS experience.
