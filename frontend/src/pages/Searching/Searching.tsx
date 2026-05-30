import { useState, useEffect } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import ArrayInputModule from '../../components/visualizers/ArrayInputModule';
import SearchVisualizer from '../../components/visualizers/SearchVisualizer';
import SuitabilityPanel from '../../components/visualizers/SuitabilityPanel';
import SmartRecommendationEngine from '../../components/visualizers/SmartRecommendationEngine';
import EducationalSection from '../../components/common/EducationalSection';
import WarningPopup from '../../components/common/WarningPopup';

const SEARCH_ALGORITHMS = [
  { id: 'linear_search', name: 'Linear Search', tc: 'O(n)', sc: 'O(1)', desc: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.' },
  { id: 'binary_search', name: 'Binary Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.' },
  { id: 'jump_search', name: 'Jump Search', tc: 'O(√n)', sc: 'O(1)', desc: 'Similar to binary search, but for sorted arrays. It checks fewer elements by jumping ahead by fixed steps.' },
  { id: 'interpolation_search', name: 'Interpolation Search', tc: 'O(log log n)', sc: 'O(1)', desc: 'An algorithm for searching for a key in an array that has been ordered by numerical values.' },
  { id: 'exponential_search', name: 'Exponential Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Searching for a key in a sorted array by finding the range in which the key could be and then performing binary search.' },
  { id: 'fibonacci_search', name: 'Fibonacci Search', tc: 'O(log n)', sc: 'O(1)', desc: 'Searching for a key in a sorted array using Fibonacci numbers to narrow down the search range.' },
];

const Searching = () => {
  const [array, setArray] = useState<number[]>([1, 4, 7, 12, 24, 38, 45, 52, 67, 71, 89]);
  const [target, setTarget] = useState<number>(45);
  const [selectedAlgo, setSelectedAlgo] = useState(SEARCH_ALGORITHMS[0]);
  const [recommendations, setRecommendations] = useState([]);
  const [suitability, setSuitability] = useState<any[]>([]);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingAlgo, setPendingAlgo] = useState<any>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [array]);

  const fetchRecommendations = async () => {
    try {
      const isSorted = [...array].sort((a,b) => a-b).every((v,i) => v === array[i]);
      const res = await axios.post('http://localhost:8000/api/recommend/searching', { array });
      setRecommendations(res.data);

      const suit = SEARCH_ALGORITHMS.map(a => ({
        name: a.name,
        suitable: a.id === 'linear_search' || isSorted,
        reason: (a.id !== 'linear_search' && !isSorted) ? 'Requires a sorted array.' : undefined
      }));
      setSuitability(suit);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlgoSelect = (algo: any) => {
    const isSorted = [...array].sort((a,b) => a-b).every((v,i) => v === array[i]);
    if (algo.id !== 'linear_search' && !isSorted) {
      setPendingAlgo(algo);
      setIsWarningOpen(true);
    } else {
      setSelectedAlgo(algo);
    }
  };

  const handleSortAndContinue = () => {
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    if (pendingAlgo) setSelectedAlgo(pendingAlgo);
    setIsWarningOpen(false);
  };

  return (
    <PageWrapper>
      <WarningPopup
        isOpen={isWarningOpen}
        message={`${pendingAlgo?.name} requires a sorted array. Would you like ArrayIQ to sort the array automatically before searching?`}
        onConfirm={handleSortAndContinue}
        onCancel={() => setIsWarningOpen(false)}
      />

      <div className="space-y-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ArrayInputModule onArrayChange={setArray} initialArray={array} />
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <h3 className="font-bold font-syne">Search Target</h3>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <SearchVisualizer array={array} target={target} algorithm={selectedAlgo.id} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <SmartRecommendationEngine recommendations={recommendations} />
          </div>
          <div className="lg:col-span-1">
             <SuitabilityPanel algorithms={suitability} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SEARCH_ALGORITHMS.map(algo => (
            <button
              key={algo.id}
              onClick={() => handleAlgoSelect(algo)}
              className={`p-8 rounded-3xl border transition-all text-left space-y-4 ${selectedAlgo.id === algo.id ? 'bg-accent/10 border-accent text-accent shadow-[0_0_30px_rgba(0,217,255,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
            >
              <h4 className="text-xl font-bold font-syne">{algo.name}</h4>
              <p className="text-xs opacity-60 line-clamp-2">{algo.desc}</p>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span>{algo.tc}</span>
                <span>{algo.sc}</span>
              </div>
            </button>
          ))}
        </div>

        <EducationalSection
          name={selectedAlgo.name}
          description={selectedAlgo.desc}
          pros={["Low overhead", "Easy to implement"]}
          cons={["Slow for large datasets"]}
          bestUseCases="When you need to find an item in a collection and don't know if it is sorted."
          complexity={{
            best: 'O(1)',
            avg: selectedAlgo.tc,
            worst: selectedAlgo.tc,
            space: selectedAlgo.sc
          }}
        />
      </div>
    </PageWrapper>
  );
};

export default Searching;
