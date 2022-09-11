import React, { useState } from 'react';
import './Input.css';

export default function Input({ delay }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <input
      className="input"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        delay(inputValue);
      }}
      placeholder="Type to search..."
    />
  );
}
