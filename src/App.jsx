import React, { useState, useEffect } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import './App.css';

const sortingAlgorithms = ['Selection Sort', 'Insertion Sort','Bubble Sort', 'Quick Sort', 'Merge Sort', 'Bucket Sort'];

const App = () => {
  const [arrayLength, setArrayLength] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [sortClicked, setSortClicked] = useState(false);
  const [array, setArray] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  useEffect(() => {
    setArray(Array.from({length: arrayLength}, () => Math.random()));
  }, [arrayLength]);

  const handleChange = (e) => {
    setArrayLength(e.target.value);
  };

  const selectAlgorithm = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const selectionSort = async (inputArr) => {
    let n = inputArr.length;
        
    for(let i = 0; i < n; i++) {
      // Finding the smallest number in the subarray
      let min = i;
      for(let j = i+1; j < n; j++){
        if(inputArr[j] < inputArr[min]) {
          min=j; 
        }
      }
      if (min !== i) {
        // Swapping the elements
        let tmp = inputArr[i]; 
        inputArr[i] = inputArr[min];
        setHighlightedIndices([i, min]); // Add this line
        await new Promise(resolve => setTimeout(resolve, 10)); // Add delay
        inputArr[min] = tmp;
      }
      await new Promise(resolve => setTimeout(resolve, 10)); // 10 ms delay
      setArray([...inputArr]);
      setHighlightedIndices([]);
    }
    return inputArr;
  };

  const insertionSort = async (inputArr) => {
    let n = inputArr.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = inputArr[i];
      // The last element of our sorted subarray
      let j = i-1; 
      while ((j > -1) && (current < inputArr[j])) {
        setHighlightedIndices([j]); // highlight the bar that is being compared
        await new Promise(resolve => setTimeout(resolve, 0.5));
        inputArr[j+1] = inputArr[j];
        j--;
        setArray([...inputArr]);
      }
      inputArr[j+1] = current;
      setArray([...inputArr]);
    }
    setHighlightedIndices([]);
    return inputArr;
  };

  const partition = async (arr, low, high) => {
    // Taking the last element as the pivot
    const pivotValue = arr[high];
    let pivotIndex = low;
    for (let i = low; i < high; i++) {
      if (arr[i] < pivotValue) {
        // Swapping elements
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        // Moving to next element
        pivotIndex++;
        setHighlightedIndices([i, pivotIndex]);
        await new Promise(resolve => setTimeout(resolve, 20)); // 50 ms delay
        setArray([...arr]);
      }
    }
    // Putting the pivot value in the middle
    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    setHighlightedIndices([pivotIndex, high]);
    await new Promise(resolve => setTimeout(resolve, 20)); // 50 ms delay
    setArray([...arr]);
    return pivotIndex;
  };
  
  const quickSort = async (arr, low = 0, high = arr.length - 1) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      setArray([...arr]);
      await quickSort(arr, pi + 1, high);
      setArray([...arr]);
    }
    setHighlightedIndices([]);
    return arr;
  };
  

  const bubbleSort = async (inputArr) => {
    let len = inputArr.length;
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < len; i++) {
        setHighlightedIndices([i, i+1]); // highlight the bars that are being compared
        await new Promise(resolve => setTimeout(resolve, 1)); // 50 ms delay
        if (inputArr[i] > inputArr[i + 1]) {
          let tmp = inputArr[i];
          inputArr[i] = inputArr[i + 1];
          inputArr[i + 1] = tmp;
          swapped = true;
          setArray([...inputArr]);
        }
      }
    } while (swapped);
    setHighlightedIndices([]);
    return inputArr;
  };
  
  const merge = async (arr, start, mid, end) => {
    let start2 = mid + 1;
  
    // If the direct predecessor of start2 is smaller than start2, then it's already sorted
    if (arr[mid] <= arr[start2]) {
      return;
    }
  
    // Two pointers to maintain start of both arrays to merge
    while (start <= mid && start2 <= end) {
      setHighlightedIndices([start, start2]); // Highlight the bars that are being compared
      await new Promise(resolve => setTimeout(resolve, 10)); // 10 ms delay
  
      // If element 1 is in right place
      if (arr[start] <= arr[start2]) {
        start++;
      } else {
        let value = arr[start2];
        let index = start2;
  
        // Shift all the elements between element 1 and element 2, right by 1.
        while (index != start) {
          arr[index] = arr[index - 1];
          index--;
        }
        arr[start] = value;
        start++;
        mid++;
        start2++;
        setArray([...arr]);
      }
    }
  };
  
  const mergeSort = async (arr, l, r) => {
    if (l < r) {
      let m = l + Math.floor((r - l) / 2);
  
      // Sort first and second halves
      await mergeSort(arr, l, m);
      await mergeSort(arr, m + 1, r);

      await merge(arr, l, m, r);
    }
  };
  
  const bucketSort = async (arr, numBuckets = 5) => {
    if (arr.length === 0) {
      return arr;
    }
  
    // Determining minimum and maximum values
    let min = arr[0];
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i];
      } else if (arr[i] > max) {
        max = arr[i];
      }
    }
  
    // Initialize buckets
    let bucketSize = Math.floor((max - min) / numBuckets) + 1;
    let bucketCount = Math.floor((max - min) / bucketSize) + 1;
    let buckets = new Array(bucketCount);
    for (let i = 0; i < buckets.length; i++) {
      buckets[i] = [];
    }
  
    // Distribute input array values into buckets
    for (let i = 0; i < arr.length; i++) {
      let bucketIndex = Math.floor((arr[i] - min) / bucketSize);
      buckets[bucketIndex].push(arr[i]);
      setArray([...arr]);
      setHighlightedIndices([i]);
      await new Promise(resolve => setTimeout(resolve, 10)); // 50 ms delay
    }
  
    // Sort buckets and place back into input array
    let arrIndex = 0;
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].sort((a, b) => a - b);
      for (let j = 0; j < buckets[i].length; j++) {
        arr[arrIndex++] = buckets[i][j];
        setArray([...arr]);
        setHighlightedIndices([arrIndex - 1]);
        await new Promise(resolve => setTimeout(resolve, 10)); // 50 ms delay
      }
    }
  
    setHighlightedIndices([]);
  };
  
  // Update your sortArray function
  const sortArray = async () => {
    setSortClicked(true);
    if (selectedAlgorithm === "Selection Sort") {
      await selectionSort(array);
    } else if (selectedAlgorithm === "Insertion Sort") {
      await insertionSort(array);
    } else if (selectedAlgorithm === "Quick Sort") {
      await quickSort(array);
    } else if (selectedAlgorithm === "Bubble Sort") {
      await bubbleSort(array);
    } else if (selectedAlgorithm === "Merge Sort") {
      await mergeSort(array, 0, array.length - 1);
    } else if (selectedAlgorithm === "Bucket Sort") {
      await bucketSort(array);
    }
    setHighlightedIndices([]);
  };
  
  
  return (
    <div className="app-container">
      <ArrayVisualizer array={array} highlightedIndices={highlightedIndices} />
      <div className="button-container">
        {sortingAlgorithms.map((algorithm) => (
          <button
            key={algorithm}
            className={selectedAlgorithm === algorithm ? 'selected' : ''}
            onClick={() => selectAlgorithm(algorithm)}
          >
            {algorithm}
          </button>
        ))}
        <button className={`sort-button ${sortClicked ? 'selected' : ''}`} onClick={sortArray}>
          Sort!
        </button>
      </div>

      <div className="slider-container">
        <div>
        <div># of bars: {arrayLength}</div>
          <input
            type="range"
            min="0"
            max="300"
            value={arrayLength}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
