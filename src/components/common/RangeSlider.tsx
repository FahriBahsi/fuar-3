'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';

interface RangeSliderProps {
  min?: number;
  max?: number;
  defaultValue?: [number, number];
  onChange?: (values: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

/**
 * Custom Range Slider component wrapping rc-slider
 * Replaces jQuery UI Slider with React alternative
 */
export default function RangeSlider({
  min = 0,
  max = 1000,
  defaultValue = [0, max],
  onChange,
  formatLabel = (value) => `$${value}`,
  className = '',
}: RangeSliderProps) {
  const [values, setValues] = useState<[number, number]>(defaultValue);

  const handleChange = (newValues: number | number[]) => {
    const rangeValues = Array.isArray(newValues) ? (newValues as [number, number]) : [min, newValues as number] as [number, number];
    setValues(rangeValues);
    if (onChange) {
      onChange(rangeValues);
    }
  };

  return (
    <div className={`range-slider-wrapper ${className}`}>
      <Slider
        range
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={handleChange}
        styles={{
          track: {
            backgroundColor: '#FF4081',
          },
          handle: {
            borderColor: '#FF4081',
            backgroundColor: '#fff',
            opacity: 1,
            width: 18,
            height: 18,
          },
          rail: {
            backgroundColor: '#D8D8D8',
            height: 4,
          },
        }}
      />
      <div className="range-values" style={{ marginTop: '15px', textAlign: 'center', color: '#272b41', fontWeight: 600 }}>
        <span className="amount">
          {formatLabel(values[0])} - {formatLabel(values[1])}
        </span>
        
      </div>
    </div>
  );
}

