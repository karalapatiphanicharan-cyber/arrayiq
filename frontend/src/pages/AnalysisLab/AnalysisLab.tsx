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
import { Search, Layers, Columns, Play, Download, ChevronDown, Check } from 'lucide-react';
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

    const handleAlgoSelect = (algo: any) => {
        if (activeTab === 'compare') {
            setSelectedCompareAlgos(prev =>
                prev.includes(algo.name) ? prev.filter(a => a !== algo.name) : [...prev, algo.name]
            );
            return;
        }

        const isSorted = [...array].sort((a,b) => a-b).every((v,i) => v === array[i]);
        if (activeTab === 'search' && algo.id !== 'linear_search' && !isSorted) {
            setPendingAlgo(algo);
            setIsWarningOpen(true);
        } else {
            if (activeTab === 'sort') setSelectedSort(algo);
            else setSelectedSearch(algo);
        }
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
        { id: 'compare', label: 'Compare Mode', icon: Columns },
    ];

    const quickNav = [
        { label: 'Input', id: 'input-section' },
        { label: 'Recommendations', id: 'rec-section' },
        { label: 'Laboratory', id: 'lab-section' },
        { label: 'Results', id: 'results-section' },
        { label: 'Educational', id: 'edu-section' },
    ];

    return (
        <PageWrapper>
            <WarningPopup
                isOpen={isWarningOpen}
                message={`${pendingAlgo?.name} requires a sorted array. Would you like ArrayIQ to sort the array automatically?`}
                onConfirm={handleSortAndContinue}
                onCancel={() => setIsWarningOpen(false)}
            />

            <div className="fixed left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 z-40">
                {quickNav.map(nav => (
                    <button key={nav.id} onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-4 text-left">
                        <div className="w-1 h-8 bg-white/5 rounded-full group-hover:bg-primary transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{nav.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-12 pb-32">
                <div id="input-section" className="grid lg:grid-cols-12 gap-6 scroll-mt-32">
                    <div className="lg:col-span-4">
                        <ArrayInputModule onArrayChange={setArray} initialArray={array} />
                    </div>
                    <div className="lg:col-span-8">
                        <AdvancedArrayInsightsPanel array={array} />
                    </div>
                </div>

                <div id="rec-section" className="grid md:grid-cols-2 gap-6 scroll-mt-32">
                    <RecommendationCard recommendation={searchRec} type="search" />
                    <RecommendationCard recommendation={sortRec} type="sort" />
                </div>

                <div id="lab-section" className="sticky top-28 z-40 flex justify-center scroll-mt-32">
                    <div className="glass p-2 rounded-[24px] flex gap-2 shadow-2xl border border-white/10">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as any); setBenchmarkResults([]); setSelectedCompareAlgos([]); }}
                                className={cn(
                                    "flex items-center gap-3 px-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                                    activeTab === tab.id ? "bg-white text-black shadow-xl scale-105" : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 pt-8">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="glass-card p-8 rounded-[32px] space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold font-syne flex items-center gap-3">
                                    <Play className="w-5 h-5 text-primary" />
                                    {activeTab === 'compare' ? 'Select Multi' : 'Controls'}
                                </h3>
                                <ChevronDown className="w-4 h-4 text-white/20" />
                            </div>

                            {activeTab === 'compare' && (
                                <div className="flex bg-white/5 p-1 rounded-xl">
                                    <button
                                        onClick={() => { setCompareType('sorting'); setSelectedCompareAlgos([]); }}
                                        className={cn("flex-grow py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", compareType === 'sorting' ? "bg-primary text-white" : "text-white/40")}
                                    >Sort</button>
                                    <button
                                        onClick={() => { setCompareType('searching'); setSelectedCompareAlgos([]); }}
                                        className={cn("flex-grow py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", compareType === 'searching' ? "bg-accent text-black" : "text-white/40")}
                                    >Search</button>
                                </div>
                            )}

                            {(activeTab === 'search' || (activeTab === 'compare' && compareType === 'searching')) && (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-1">Target Identity</label>
                                    <input
                                        type="number"
                                        value={target}
                                        onChange={(e) => setTarget(Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg font-syne font-bold focus:outline-none focus:border-accent transition-all focus:bg-white/[0.08]"
                                    />
                                </div>
                            )}

                            <div className="grid gap-3">
                                {(activeTab === 'search' ? SEARCH_ALGORITHMS : (activeTab === 'compare' ? (compareType === 'sorting' ? SORT_ALGORITHMS : SEARCH_ALGORITHMS) : SORT_ALGORITHMS)).map(algo => (
                                    <button
                                        key={algo.id}
                                        onClick={() => handleAlgoSelect(algo)}
                                        className={cn(
                                            "text-left p-4 rounded-2xl border transition-all relative group overflow-hidden flex justify-between items-center",
                                            activeTab === 'compare'
                                                ? (selectedCompareAlgos.includes(algo.name) ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5")
                                                : ((activeTab === 'sort' ? selectedSort.id : selectedSearch.id) === algo.id ? "bg-primary text-white border-primary shadow-lg" : "bg-white/5 border-white/5 hover:border-white/20")
                                        )}
                                    >
                                        <div className="relative z-10">
                                            <div className="font-bold text-sm mb-1">{algo.name}</div>
                                            <div className={cn("text-[9px] uppercase font-bold tracking-widest", (activeTab === 'sort' ? selectedSort.id : selectedSearch.id) === algo.id ? "text-white/60" : "opacity-30")}>
                                                {algo.tc}
                                            </div>
                                        </div>
                                        {activeTab === 'compare' && selectedCompareAlgos.includes(algo.name) && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <SuitabilityPanel algorithms={suitability} />
                    </div>

                    <div className="lg:col-span-9 space-y-10">
                        {activeTab !== 'compare' ? (
                            <div className="space-y-10">
                                <motion.div key={activeTab + (activeTab === 'sort' ? selectedSort.id : selectedSearch.id)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                                    {activeTab === 'sort' ? <SortingVisualizer array={array} algorithm={selectedSort.id} /> : <SearchVisualizer array={array} target={target} algorithm={selectedSearch.id} />}
                                </motion.div>
                            </div>
                        ) : (
                            <div className="glass-card p-16 rounded-[48px] h-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 -z-10" />
                                <div className="bg-primary/20 p-10 rounded-[32px] glow-primary border border-primary/20">
                                    <Columns className="w-20 h-20 text-primary" />
                                </div>
                                <div className="space-y-4 max-w-xl">
                                    <h3 className="text-5xl font-syne font-extrabold tracking-tight">Enterprise Comparison</h3>
                                    <p className="text-white/40 text-xl font-medium leading-relaxed">
                                        Select multiple algorithms from the sidebar and click the button below to see a detailed side-by-side performance breakdown.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={runBenchmark}
                                        disabled={loading || selectedCompareAlgos.length === 0}
                                        className="bg-white text-black hover:bg-primary hover:text-white px-12 py-6 rounded-[24px] font-bold text-lg flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Analyzing Latency...' : <><Play className="w-6 h-6 fill-current" /> Run Lab Benchmarking</>}
                                    </button>
                                    {selectedCompareAlgos.length === 0 && <p className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Select at least one algorithm to begin</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div id="results-section" className="scroll-mt-32 pt-10">
                    <AnimatePresence>
                        {benchmarkResults.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">High-Precision Telemetry Ready</span>
                                        </div>
                                        <h2 className="text-5xl font-syne font-extrabold tracking-tight">Lab Performance breakdown</h2>
                                        <p className="text-white/40 max-w-xl font-medium italic">Mathematical execution results derived from 5-iteration averaging with high-precision microsecond timing.</p>
                                    </div>
                                    <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-3 transition-all">
                                        <Download className="w-4 h-4" /> Export Raw Telemetry
                                    </button>
                                </div>
                                <BenchmarkDashboard results={benchmarkResults} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div id="edu-section" className="scroll-mt-32 pt-20 border-t border-white/5">
                    <EducationalSection
                        name={activeTab === 'sort' ? selectedSort.name : selectedSearch.name}
                        description={activeTab === 'sort' ? selectedSort.desc : selectedSearch.desc}
                        pros={["Optimized for this dataset", "AI Recommended"]}
                        cons={["Requires specific conditions"]}
                        bestUseCases="Use when dataset characteristics align with the AI-recommended signature."
                        complexity={{
                            best: 'O(1)',
                            avg: activeTab === 'sort' ? selectedSort.tc : selectedSearch.tc,
                            worst: activeTab === 'sort' ? selectedSort.tc : selectedSearch.tc,
                            space: activeTab === 'sort' ? selectedSort.sc : selectedSearch.sc
                        }}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AnalysisLab;
