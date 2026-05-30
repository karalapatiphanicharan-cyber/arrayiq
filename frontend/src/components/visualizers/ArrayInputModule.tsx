import { useState } from 'react';
import { Shuffle, RotateCcw, Trash2, Database } from 'lucide-react';

interface ArrayInputModuleProps {
  onArrayChange: (newArray: any[]) => void;
  initialArray?: any[];
}

const ArrayInputModule: React.FC<ArrayInputModuleProps> = ({ onArrayChange, initialArray = [8, 2, 5, 1, 9, 4] }) => {
  const [inputValue, setInputValue] = useState(initialArray.join(', '));
  const [arraySize, setArraySize] = useState(10);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    try {
      const parsed = e.target.value.split(',').map(s => {
        const trimmed = s.trim();
        if (!trimmed) return null;
        const num = Number(trimmed);
        return isNaN(num) ? trimmed : num;
      }).filter(v => v !== null);
      onArrayChange(parsed);
    } catch (err) {}
  };

  const generateRandom = (size: number = arraySize) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setInputValue(newArr.join(', '));
    onArrayChange(newArr);
  };

  const loadSample = (type: string) => {
    let sample: any[] = [];
    switch (type) {
      case 'sorted': sample = [1, 5, 12, 24, 38, 45, 52, 67, 71, 89]; break;
      case 'reverse': sample = [90, 81, 72, 63, 54, 45, 36, 27, 18, 9]; break;
      case 'nearly': sample = [2, 1, 3, 4, 6, 5, 7, 8, 10, 9]; break;
      case 'duplicates': sample = [5, 2, 5, 8, 2, 9, 1, 5, 4, 8]; break;
      default: sample = [8, 2, 5, 1, 9, 4];
    }
    setInputValue(sample.join(', '));
    onArrayChange(sample);
  };

  return (
    <div className="glass-card p-8 rounded-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-syne flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> Array Input
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setInputValue('')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleManualInput}
            placeholder="Enter values separated by commas (e.g. 8, 2, 5, 1)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => generateRandom()} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors">
            <Shuffle className="w-3 h-3" /> Random
          </button>
          <button onClick={() => loadSample('sorted')} className="bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors">
             Sorted
          </button>
          <button onClick={() => loadSample('nearly')} className="bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors">
             Nearly Sorted
          </button>
          <button onClick={() => loadSample('duplicates')} className="bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors">
             Duplicates
          </button>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs text-white/40 whitespace-nowrap">Size: {arraySize}</span>
          <input
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <button
            onClick={() => generateRandom(arraySize)}
            className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrayInputModule;
