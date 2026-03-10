'use client';

import dynamic from 'next/dynamic';
import { Props as SelectProps, StylesConfig } from 'react-select';
import ClientOnly from './ClientOnly';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends Omit<SelectProps<Option, boolean>, 'styles'> {
  className?: string;
}

// Dynamically import ReactSelect with no SSR to prevent hydration mismatch
const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="select-loading">
      <div style={{ 
        minHeight: '46px', 
        border: '1px solid #ced4da', 
        borderRadius: '0.25rem',
        padding: '8px 12px',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        color: '#9299b8'
      }}>
        Loading...
      </div>
    </div>
  )
});

/**
 * Custom Select component wrapping react-select
 * Styled to match the original template design
 * Prevents hydration mismatch by disabling SSR
 */
export default function Select({ className = '', ...props }: CustomSelectProps) {
  const customStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '46px',
      borderColor: state.isFocused ? '#667eea' : '#ced4da',
      borderRadius: '0.25rem',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(102, 126, 234, 0.25)' : 'none',
      backgroundColor: '#fff',
      '&:hover': {
        borderColor: '#667eea',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'inherit',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'inherit',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#667eea'
        : state.isFocused
        ? '#f5f7fc'
        : 'transparent',
      color: state.isSelected ? '#fff' : '#272b41',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#667eea',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e3e6ef',
      borderRadius: '0.2rem',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#272b41',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#9299b8',
      '&:hover': {
        backgroundColor: '#667eea',
        color: '#fff',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9299b8',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: 'absolute' as const,
    }),
  };

  return (
    <ClientOnly fallback={
      <div className="select-loading">
        <div style={{ 
          minHeight: '46px', 
          border: '1px solid #ced4da', 
          borderRadius: '0.25rem',
          padding: '8px 12px',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          color: '#9299b8'
        }}>
          Loading...
        </div>
      </div>
    }>
      <ReactSelect
        {...(props as any)}
        styles={customStyles}
        className={className}
        classNamePrefix="react-select"
      />
    </ClientOnly>
  );
}

