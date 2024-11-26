import React, { useState } from 'react';

function Counter({label,onCountChange }) {
  const [count, setCount] = useState(1); // Initial number of s

  // Function to increase the  count
  const incrementCount = () => {
    setCount(count + 1);
    onCountChange(count+1);
  };

  // Function to decrease the  count
  const decrementCount = () => {
    if (count > 0) { // Ensures the  count doesn't go below 1
      setCount(count - 1);
      onCountChange(count-1);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className='text-gray-700'>{label} :</span>
      <button 
        onClick={decrementCount} 
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
      >
        -
      </button>
      
      <span >{count}</span>
      
      <button 
        onClick={incrementCount} 
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
      >
        +
      </button>
      
      
    </div>
  );
}

export default Counter;