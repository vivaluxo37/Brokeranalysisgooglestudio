import React, { useState, useRef, useEffect } from 'react'

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiChange?: (values: string[]) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  multiSelect = false,
  selectedValues = [],
  onMultiChange,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSingleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  const handleMultiSelect = (selectedValue: string) => {
    if (!onMultiChange) {return}

    const newValues = selectedValues.includes(selectedValue)
      ? selectedValues.filter(v => v !== selectedValue)
      : [...selectedValues, selectedValue]

    onMultiChange(newValues)
  }

  const handleClear = () => {
    if (multiSelect) {
      onMultiChange?.([])
    } else {
      onChange('')
    }
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) {return placeholder}
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0])
        return option?.label || selectedValues[0]
      }
      return `${selectedValues.length} selected`
    }
    const option = options.find(opt => opt.value === value)
    return option?.label || placeholder
  }

  const hasValue = multiSelect ? selectedValues.length > 0 : Boolean(value)

  return (
    <div className={`filter-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`block truncate ${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
            {getDisplayValue()}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {hasValue && (
              <button
                onClick={handleClear}
                className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 border-b border-gray-200"
              >
                Clear selection
              </button>
            )}
            {options.map((option) => {
              const isSelected = multiSelect
                ? selectedValues.includes(option.value)
                : option.value === value

              return (
                <button
                  key={option.value}
                  onClick={() => multiSelect ? handleMultiSelect(option.value) : handleSingleSelect(option.value)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-900 font-medium' : 'text-gray-900'
                  }`}
                >
                  {multiSelect && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                  {!multiSelect && option.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
