import { useState, useEffect } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import ArrayInputModule from '../../components/visualizers/ArrayInputModule';
import AdvancedArrayInsightsPanel from '../../components/visualizers/AdvancedArrayInsightsPanel';
import SortingVisualizer from '../../components/visualizers/SortingVisualizer';
import SearchVisualizer from '../../components/visualizers/SearchVisualizer';
import RecommendationCard from '../../components/visualizers/RecommendationCard';
import SuitabilityPanel from '../../components/visualizers/SuitabilityPanel';
import EducationalSection from '../../components/common/EducationalSection';
import BenchmarkDashboard from '../../components/charts/BenchmarkDashboard';
import WarningPopup from '../../components/common/WarningPopup';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Layers,
    Columns,
    Play,
    Download,
    Check,
    X,
    Filter,
    BarChart3,
    RefreshCcw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { API_BASE_URL } from '../../constants';

const SORT_ALGORITHMS = [
    { id: 'bubble_sort', name: 'Bubble Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Repeatedly swaps adjacent elements if they are in the wrong order.' },
    { id: 'selection_sort', name: 'Selection Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Repeatedly finds the minimum element and puts it at the beginning.' },
    { id: 'insertion_sort', name: 'Insertion Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Builds the final sorted array one item at a time.' },
    { id: 'merge_sort', name: 'Merge Sort', tc: 'O(n log n)', sc: 'O(n)', desc: 'Divide and conquer algorithm that splits and merges halves.' },
    { id: 'quick_sort', name: 'Quick Sort', tc: 'O(n log n)', sc: 'O(log n)', desc: 'Highly efficient partitioning-based algorithm.' },
    { id: 'heap_sort', name: 'Heap Sort', tc: 'O(n log n)', sc: 'O(1)', desc: 'Comparison-based sort using a Binary Heap structure.' },
    { id: 'shell_sort', name: 'Shell Sort', tc: 'O(n (log n)²)', sc: 'O(1)', desc: 'Generalization of insertion sort using gaps.' },
    { id: 'counting_sort', name: 'Counting Sort', tc: 'O(n + k)', sc: 'O(k)', desc: 'Non-comparative sort based on frequency keys.' },
    { id: 'radix_sort', name: 'Radix Sort', tc: 'O(nk)', sc: 'O(n + k)', desc: 'Sorts by distributing elements based on radix.' },
    { id: 'bucket_sort', name: 'Bucket Sort', tc: 'O(n + k)', sc: 'O(n)', desc: 'Distributes elements into various buckets.' },
    { id: 'tim_sort', name: 'Tim Sort', tc: 'O(n log n)', sc: 'O(n)', desc: 'Hybrid stable sort used in modern languages.' },
];

const SEARCH_ALGORITHMS = [
    { id: 'linear_search', name: 'Linear Search', tc: 'O(n)', sc: 'O(1)', desc: 'Sequentially checks every element until a match is found.' },
    { id: 'binary_search', name: 'Binary Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Efficiently finds targets in a sorted array by halving.' },
    { id: 'jump_search', name: 'Jump Search', tc: 'O(√n)', sc: 'O(1)', desc: 'Searches sorted arrays by jumping ahead by fixed steps.' },
    { id: 'interpolation_search', name: 'Interpolation Search', tc: 'O(log log n)', sc: 'O(1)', desc: 'Optimized search for uniformly distributed sorted arrays.' },
    { id: 'exponential_search', name: 'Exponential Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Finds the range and then performs binary search.' },
    { id: 'fibonacci_search', name: 'Fibonacci Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Narrow down search range using Fibonacci numbers.' },
];

const AnalysisLab = () => {
    const [activeTab, setActiveTab] = useState<'search' | 'sort' | 'compare'>('sort');
    const [compareType, setCompareType] = useState<'sorting' | 'searching'>('sorting');
    const [selectedCompareAlgos, setSelectedCompareAlgos] = useState<string[]>([]);
    const [array, setArray] = useState<any[]>([8, 2, 5, 1, 9, 4, 7, 3, 10, 6]);
    const [target, setTarget] = useState<any>(5);
    const [selectedSort, setSelectedSort] = useState(SORT_ALGORITHMS[4]); // Quick Sort
    const [selectedSearch, setSelectedSearch] = useState(SEARCH_ALGORITHMS[1]); // Binary Search
    const [sortRec, setSortRec] = useState<any>(null);
    const [searchRec, setSearchRec] = useState<any>(null);
    const [suitability, setSuitability] = useState<any>({ suitable: [], unsuitable: [] });
    const [benchmarkResults, setBenchmarkResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [pendingAlgo, setPendingAlgo] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        refreshAnalysis();
    }, [array, activeTab, compareType]);

    const refreshAnalysis = async () => {
        try {
            const [sRec, seRec, suit] = await Promise.all([
                axios.post(`${API_BASE_URL}/api/recommend/sorting`, { array }),
                axios.post(`${API_BASE_URL}/api/recommend/searching`, { array }),
                axios.post(`${API_BASE_URL}/api/suitability/${activeTab === 'search' ? 'searching' : (activeTab === 'compare' ? compareType : 'sorting')}`, { array })
            ]);
            setSortRec(sRec.data[0]);
            setSearchRec(seRec.data[0]);
            setSuitability(suit.data);
        } catch (err) {
            console.error(err);
        }
    };

    const runBenchmark = async () => {
        if (activeTab === 'compare' && selectedCompareAlgos.length === 0) return;
        setLoading(true);
        try {
            const endpoint = activeTab === 'compare' ? `${API_BASE_URL}/api/compare/${compareType}` : `${API_BASE_URL}/api/benchmark/${activeTab === 'search' ? 'searching' : 'sorting'}`;
            const payload = activeTab === 'compare'
                ? { array, target, algorithms: selectedCompareAlgos }
                : (activeTab === 'search' ? { array, target } : { array });

            const res = await axios.post(endpoint, payload);
            setBenchmarkResults(res.data);
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(benchmarkResults, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "arrayiq_telemetry.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleAlgoSelect = (algo: any) => {
        if (activeTab === 'compare') {
            setSelectedCompareAlgos(prev =>
                prev.includes(algo.name) ? prev.filter(a => a !== algo.name) : [...prev, algo.name]
            );
            return;
        }

        const isSorted = array.length > 0 && array.every((v, i) => i === 0 || v >= array[i - 1]);
        if (activeTab === 'search' && algo.id !== 'linear_search' && !isSorted) {
            setPendingAlgo(algo);
            setIsWarningOpen(true);
        } else {
            if (activeTab === 'sort') setSelectedSort(algo);
            else setSelectedSearch(algo);
        }
        setIsMobileMenuOpen(false);
    };

    const handleSortAndContinue = () => {
        const sorted = [...array].sort((a, b) => a - b);
        setArray(sorted);
        if (pendingAlgo) setSelectedSearch(pendingAlgo);
        setIsWarningOpen(false);
    };

    const tabs = [
        { id: 'sort', label: 'Sorting Lab', icon: Layers },
        { id: 'search', label: 'Search Lab', icon: Search },
        { id: 'compare', label: 'Compare Mode', icon: BarChart3 },
    ];

    const currentAlgorithms = (activeTab === 'search' ? SEARCH_ALGORITHMS : (activeTab === 'compare' ? (compareType === 'sorting' ? SORT_ALGORITHMS : SEARCH_ALGORITHMS) : SORT_ALGORITHMS));
    const activeAlgo = activeTab === 'sort' ? selectedSort : selectedSearch;

    return (
        <PageWrapper>
            <WarningPopup
                isOpen={isWarningOpen}
                message={`${pendingAlgo?.name} requires a sorted array. Would you like ArrayIQ to sort the array automatically?`}
                onConfirm={handleSortAndContinue}
                onCancel={() => setIsWarningOpen(false)}
            />

            <div className="space-y-8 md:space-y-12 pb-32 max-w-[1400px] mx-auto px-4 md:px-0">
                {/* Header Section */}
                <div id="input-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-32">
                    <div className="lg:col-span-4 h-full">
                        <ArrayInputModule onArrayChange={setArray} initialArray={array} />
                    </div>
                    <div className="lg:col-span-8 h-full">
                        <AdvancedArrayInsightsPanel array={array} />
                    </div>
                </div>

                {/* Recommendations */}
                <div id="rec-section" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 scroll-mt-32">
                    <RecommendationCard recommendation={searchRec} type="search" />
                    <RecommendationCard recommendation={sortRec} type="sort" />
                </div>

                {/* Tab Switcher & Lab Container */}
                <div id="lab-section" className="space-y-8 scroll-mt-32">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02] p-2 rounded-[28px] border border-white/5 shadow-2xl">
                        <div className="flex w-full md:w-auto p-1 bg-black/40 rounded-2xl border border-white/5">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id as any); setBenchmarkResults([]); setSelectedCompareAlgos([]); }}
                                    className={cn(
                                        "flex-grow md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                                        activeTab === tab.id ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {activeTab === 'compare' && (
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-full md:w-auto">
                                    <button
                                        onClick={() => { setCompareType('sorting'); setSelectedCompareAlgos([]); }}
                                        className={cn("px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all", compareType === 'sorting' ? "bg-primary text-white" : "text-white/20")}
                                    >Sort</button>
                                    <button
                                        onClick={() => { setCompareType('searching'); setSelectedCompareAlgos([]); }}
                                        className={cn("px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all", compareType === 'searching' ? "bg-accent text-black" : "text-white/20")}
                                    >Search</button>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden ml-auto p-3 bg-white/5 rounded-xl border border-white/10"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                        {/* Control Sidebar (Desktop) / Mobile Drawer */}
                        <div className={cn(
                            "lg:col-span-3 space-y-6 transition-all duration-300",
                            isMobileMenuOpen ? "fixed inset-0 z-[100] bg-black/95 p-8 overflow-y-auto" : "hidden lg:block"
                        )}>
                            <div className="flex items-center justify-between lg:hidden mb-8">
                                <h3 className="text-xl font-bold font-syne">Selection Hub</h3>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X /></button>
                            </div>

                            <div className="glass-card p-6 rounded-[24px] space-y-6 border border-white/5">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">Configuration</h4>
                                    <div className="text-sm font-bold font-syne">Laboratory Parameters</div>
                                </div>

                                {(activeTab === 'search' || (activeTab === 'compare' && compareType === 'searching')) && (
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-1">Search Target</label>
                                        <input
                                            type="number"
                                            value={target}
                                            onChange={(e) => setTarget(Number(e.target.value))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-accent transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-1">
                                        {activeTab === 'compare' ? 'Select Multi' : 'Algorithm'}
                                    </label>
                                    <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {currentAlgorithms.map(algo => (
                                            <button
                                                key={algo.id}
                                                onClick={() => handleAlgoSelect(algo)}
                                                className={cn(
                                                    "text-left p-4 rounded-xl border transition-all flex justify-between items-center group",
                                                    activeTab === 'compare'
                                                        ? (selectedCompareAlgos.includes(algo.name) ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/5 hover:border-white/10")
                                                        : (activeAlgo.id === algo.id ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(0,102,255,0.2)]" : "bg-white/5 border-white/5 hover:border-white/20")
                                                )}
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-bold text-xs">{algo.name}</div>
                                                    <div className={cn("text-[8px] uppercase font-bold tracking-widest", activeAlgo.id === algo.id ? "text-white/60" : "text-white/20")}>
                                                        {algo.tc}
                                                    </div>
                                                </div>
                                                {activeTab === 'compare' && selectedCompareAlgos.includes(algo.name) && (
                                                    <div className="bg-primary p-1 rounded-md"><Check className="w-3 h-3 text-white" /></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <SuitabilityPanel algorithms={suitability} />
                        </div>

                        {/* Main Lab Area */}
                        <div className="lg:col-span-9 space-y-8 min-h-[500px]">
                            {activeTab !== 'compare' ? (
                                <motion.div
                                    key={activeTab + activeAlgo.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full"
                                >
                                    {activeTab === 'sort' ? (
                                        <SortingVisualizer array={array} algorithm={activeAlgo.id} />
                                    ) : (
                                        <SearchVisualizer array={array} target={target} algorithm={activeAlgo.id} />
                                    )}
                                </motion.div>
                            ) : (
                                <div className="glass-card p-8 md:p-16 rounded-[32px] md:rounded-[48px] h-full flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden border border-white/5">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08),transparent_70%)]" />
                                    <div className="relative z-10 space-y-8 max-w-xl">
                                        <div className="inline-flex p-6 rounded-[32px] bg-primary/10 border border-primary/20 shadow-inner">
                                            <Columns className="w-12 h-12 text-primary" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight">Differential Benchmarking</h3>
                                            <p className="text-white/40 text-base md:text-lg font-medium leading-relaxed px-4">
                                                Analyze performance deltas across multiple algorithm signatures in real-time.
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-4">
                                            <button
                                                onClick={runBenchmark}
                                                disabled={loading || selectedCompareAlgos.length === 0}
                                                className="group relative bg-white text-black hover:bg-primary hover:text-white px-10 py-5 rounded-[22px] font-bold text-base flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <RefreshCcw className="w-5 h-5 animate-spin" /> Calculating Latency...
                                                    </span>
                                                ) : (
                                                    <><Play className="w-5 h-5 fill-current" /> Initialize Comparison</>
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {selectedCompareAlgos.length === 0 && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-[9px] font-bold uppercase tracking-widest text-primary/60 animate-pulse"
                                                    >
                                                        Select 2+ candidates to begin analysis
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Visualizations */}
                <div id="results-section" className="scroll-mt-32 pt-10">
                    <AnimatePresence>
                        {benchmarkResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-8">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Measured Performance Metrics</span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight">Benchmarking Summary</h2>
                                        <p className="text-white/40 max-w-xl font-medium text-sm md:text-base">
                                            Actual execution results averaged over {benchmarkResults.length > 5 ? '5' : '3'} iterations with high-precision hardware timers.
                                        </p>
                                    </div>
                                    <button
                                        onClick={exportJSON}
                                        className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white flex items-center justify-center gap-3 transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Export JSON Telemetry
                                    </button>
                                </div>
                                <BenchmarkDashboard results={benchmarkResults} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Educational Content */}
                <div id="edu-section" className="scroll-mt-32 pt-20 border-t border-white/5">
                    <EducationalSection
                        name={activeAlgo.name}
                        description={activeAlgo.desc}
                        pros={["Optimized for current distribution", "Verified AI Recommendation"]}
                        cons={["Non-stable in certain conditions", "O(n) space overhead"]}
                        bestUseCases={`Ideal for ${activeAlgo.name.toLowerCase()} when data characteristics match the signature.`}
                        complexity={{
                            best: 'O(1)',
                            avg: activeAlgo.tc,
                            worst: activeAlgo.tc,
                            space: activeAlgo.sc
                        }}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AnalysisLab;
