🚀 ArrayIQ
AI-Powered Algorithm Intelligence Platform

ArrayIQ is a full-stack algorithm analysis, benchmarking, visualization, and recommendation platform designed to help developers understand, compare, and select the most efficient searching and sorting algorithms for different datasets.

Built with a modern interactive UI, real-time visualizations, intelligent recommendations, and benchmarking tools, ArrayIQ transforms algorithm learning and performance analysis into an engaging experience.

🌐 Live Demo

Frontend:
arrayiq.vercel.app

Backend API:
ArrayIQ API

✨ Features
🔍 Intelligent Search Recommendations

ArrayIQ analyzes dataset characteristics and recommends the most suitable search algorithm based on:

Dataset size
Sorted vs unsorted state
Value distribution
Search target behavior
Computational efficiency

Supported Search Algorithms:

Linear Search
Binary Search
Jump Search
Interpolation Search
Exponential Search
Fibonacci Search
📊 Advanced Sorting Analysis

Compare and visualize multiple sorting algorithms in real time.

Supported Sorting Algorithms:

Bubble Sort
Selection Sort
Insertion Sort
Merge Sort
Quick Sort
Heap Sort
Shell Sort
Counting Sort
Radix Sort
Bucket Sort
Tim Sort
⚡ Live Algorithm Visualization

Interactive visualizations provide:

Step-by-step execution
Real-time array updates
Comparison tracking
Swap tracking
Progress indicators
Adjustable animation speed
🏆 Benchmark Engine

Run comprehensive benchmarks across multiple algorithms.

Metrics Collected:

Runtime
Comparisons
Swaps
Memory Usage
Throughput
Performance Rankings

Outputs:

Winner Selection
Benchmark Tables
Performance Charts
Efficiency Rankings
🤖 Recommendation Engine

ArrayIQ automatically recommends:

Sorting Algorithms

Based on:

Array size
Duplicate frequency
Value range
Sortedness score
Distribution characteristics
Searching Algorithms

Based on:

Search requirements
Data ordering
Dataset characteristics
Performance expectations

Includes:

Confidence Score
Recommendation Reasoning
Suitability Analysis
📈 Comparative Analytics

Compare algorithms side-by-side using:

Runtime metrics
Operation counts
Memory consumption
Efficiency rankings
Visual performance charts
🧬 Dataset Intelligence

Analyze datasets using:

Minimum Value
Maximum Value
Average
Median
Distinct Count
Duplicate Count
Distribution Analysis
🌌 Quantum Space

Educational quantum-inspired algorithm exploration environment featuring:

Grover's Search Simulation
Quantum Walk Simulation
Amplitude Amplification Concepts
Quantum Bitonic Concepts

Designed for educational visualization and comparison with classical approaches.

🏗️ Architecture
ArrayIQ
│
├── frontend
│   ├── React
│   ├── TypeScript
│   ├── Vite
│   ├── Tailwind CSS
│   ├── Recharts
│   └── Framer Motion
│
├── backend
│   ├── FastAPI
│   ├── Python
│   ├── NumPy
│   ├── Pydantic
│   └── Uvicorn
│
└── deployment
    ├── Vercel (Frontend)
    └── Render (Backend)
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Framer Motion
Recharts
Backend
FastAPI
Python
NumPy
Pydantic
Uvicorn
Deployment
Vercel
Render
🚀 Local Setup
Clone Repository
git clone https://github.com/karalapatiphanicharan-cyber/arrayiq.git
cd arrayiq
Backend Setup
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs at:

http://localhost:8000
Frontend Setup
cd frontend

npm install

npm run dev

Frontend runs at:

http://localhost:5173
⚙️ Environment Variables

Frontend:

VITE_API_URL=http://localhost:8000

Production:

VITE_API_URL=https://arrayiq-api.onrender.com
📱 Responsive Design

ArrayIQ is fully optimized for:

Desktop
Laptop
Tablet
Mobile Devices

Features include:

Adaptive layouts
Responsive charts
Mobile-friendly controls
Dynamic visualizations
🎯 Use Cases
Students
Learn algorithms visually
Understand performance trade-offs
Explore algorithm behavior
Developers
Benchmark algorithms
Compare efficiencies
Select optimal solutions
Educators
Demonstrate concepts interactively
Teach algorithm design
Visualize execution processes
📊 Future Enhancements
Graph Algorithms
Dynamic Programming Visualizations
Machine Learning Based Recommendations
Custom Benchmark Profiles
Algorithm Complexity Explorer
Dataset Import/Export
User Accounts & Saved Sessions
👨‍💻 Author

Phani Charan

GitHub: karalapatiphanicharan-cyber
⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute improvements

📢 Share feedback

"Analyze. Benchmark. Optimize." ⚡

ArrayIQ helps developers make data-driven decisions when selecting searching and sorting algorithms.
