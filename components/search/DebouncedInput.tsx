import React, { useState, useEffect, useCallback } from 'react'

interface DebouncedInputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  label?: string;
  disabled?: boolean;
}

export function DebouncedInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  debounceMs = 300,
  label,
  disabled = false,
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced change handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, onChange, debounceMs, value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(localValue)
    }
  }, [localValue, onChange])

  const handleBlur = useCallback(() => {
    onChange(localValue)
  }, [localValue, onChange])

  return (
    <div className="debounced-input">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    </div>
  )
}
