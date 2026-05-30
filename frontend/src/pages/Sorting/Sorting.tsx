import { useState, useEffect } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import ArrayInputModule from '../../components/visualizers/ArrayInputModule';
import AdvancedArrayInsightsPanel from '../../components/visualizers/AdvancedArrayInsightsPanel';
import SortingVisualizer from '../../components/visualizers/SortingVisualizer';
import SuitabilityPanel from '../../components/visualizers/SuitabilityPanel';
import SmartRecommendationEngine from '../../components/visualizers/SmartRecommendationEngine';
import EducationalSection from '../../components/common/EducationalSection';

const SORT_ALGORITHMS = [
  { id: 'bubble_sort', name: 'Bubble Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.' },
  { id: 'selection_sort', name: 'Selection Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.' },
  { id: 'insertion_sort', name: 'Insertion Sort', tc: 'O(n²)', sc: 'O(1)', desc: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.' },
  { id: 'merge_sort', name: 'Merge Sort', tc: 'O(n log n)', sc: 'O(n)', desc: 'A Divide and Conquer algorithm. It divides input array in two halves, calls itself for the two halves and then merges the two sorted halves.' },
  { id: 'quick_sort', name: 'Quick Sort', tc: 'O(n log n)', sc: 'O(log n)', desc: 'Highly efficient sorting algorithm and is based on partitioning of array of data into smaller arrays.' },
  { id: 'heap_sort', name: 'Heap Sort', tc: 'O(n log n)', sc: 'O(1)', desc: 'Comparison-based sorting technique based on Binary Heap data structure.' },
  { id: 'shell_sort', name: 'Shell Sort', tc: 'O(n (log n)²)', sc: 'O(1)', desc: 'Generalization of insertion sort that allows the exchange of items that are far apart.' },
  { id: 'counting_sort', name: 'Counting Sort', tc: 'O(n + k)', sc: 'O(k)', desc: 'Sorts the elements of an array by counting the number of occurrences of each unique element in the array.' },
  { id: 'radix_sort', name: 'Radix Sort', tc: 'O(nk)', sc: 'O(n + k)', desc: 'Non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix.' },
  { id: 'bucket_sort', name: 'Bucket Sort', tc: 'O(n + k)', sc: 'O(n)', desc: 'Distribution sort that works by partitioning an array into a number of buckets.' },
  { id: 'tim_sort', name: 'Tim Sort', tc: 'O(n log n)', sc: 'O(n)', desc: 'Hybrid stable sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.' },
];

const Sorting = () => {
  const [array, setArray] = useState<number[]>([8, 2, 5, 1, 9, 4, 7, 3]);
  const [selectedAlgo, setSelectedAlgo] = useState(SORT_ALGORITHMS[0]);
  const [recommendations, setRecommendations] = useState([]);
  const [suitability, setSuitability] = useState<any[]>([]);

  useEffect(() => {
    fetchRecommendations();
  }, [array]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/recommend/sorting', { array });
      setRecommendations(res.data);

      const suit = SORT_ALGORITHMS.map(a => ({
        name: a.name,
        suitable: array.length < 5000 || (a.id !== 'bubble_sort' && a.id !== 'selection_sort'),
        reason: array.length >= 5000 && (a.id === 'bubble_sort' || a.id === 'selection_sort') ? 'Dataset too large for quadratic complexity.' : undefined
      }));
      setSuitability(suit);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ArrayInputModule onArrayChange={setArray} />
          </div>
          <div className="lg:col-span-2">
            <AdvancedArrayInsightsPanel array={array} />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
             <SortingVisualizer array={array} algorithm={selectedAlgo.id} />
          </div>
          <div className="lg:col-span-1">
             <SuitabilityPanel algorithms={suitability} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <SmartRecommendationEngine recommendations={recommendations} />
          </div>
          <div className="lg:col-span-1 glass-card p-8 rounded-3xl">
             <h3 className="text-xl font-bold font-syne mb-6">Select Algorithm</h3>
             <div className="grid grid-cols-2 gap-2">
               {SORT_ALGORITHMS.map(algo => (
                 <button
                  key={algo.id}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`text-left p-3 rounded-xl border transition-all ${selectedAlgo.id === algo.id ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                 >
                   <div className="font-bold text-xs">{algo.name}</div>
                   <div className="text-[8px] uppercase opacity-50">{algo.tc}</div>
                 </button>
               ))}
             </div>
          </div>
        </div>

        <EducationalSection
          name={selectedAlgo.name}
          description={selectedAlgo.desc}
          pros={["Stable", "Simple implementation"]}
          cons={["Inefficient for large datasets"]}
          bestUseCases="Educational purposes and small datasets where simplicity is preferred."
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

export default Sorting;
