/**
 * React Hook for Form Validation
 * Provides easy validation and sanitization for React forms
 */

import { useState, useCallback, useEffect } from 'react'

import { validateAndSanitize, ValidationSchema, validateInput } from '../utils/validation'

interface ValidationState {
  isValid: boolean;
  errors: string[];
  isDirty: boolean;
  isSubmitting: boolean;
}

interface UseValidationOptions {
  schema: ValidationSchema;
  initialValues?: Record<string, any>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (data: any) => void | Promise<void>;
}

export function useValidation<T extends Record<string, any>>({
  schema,
  initialValues = {},
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseValidationOptions) {
  const [values, setValues] = useState<T>(initialValues as T)
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    errors: [],
    isDirty: false,
    isSubmitting: false,
  })

  // Validate current values
  const validate = useCallback((dataToValidate: T = values) => {
    const result = validateAndSanitize(dataToValidate, schema)
    setValidation(prev => ({
      ...prev,
      isValid: result.isValid,
      errors: result.errors,
    }))
    return result
  }, [values, schema])

  // Handle field change
  const handleChange = useCallback((field: keyof T, value: any) => {
    const newValues = { ...values, [field]: value }
    setValues(newValues)
    setValidation(prev => ({ ...prev, isDirty: true }))

    if (validateOnChange) {
      // Validate with debounce for better UX
      const timeoutId = setTimeout(() => {
        validate(newValues)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [values, validateOnChange, validate])

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => {
    if (validateOnBlur) {
      validate()
    }
  }, [validateOnBlur, validate])

  // Handle form submission
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault()
    }

    setValidation(prev => ({ ...prev, isSubmitting: true }))

    try {
      const result = validate()

      if (result.isValid && onSubmit) {
        await onSubmit(result.data)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setValidation(prev => ({
        ...prev,
        errors: ['Form submission failed. Please try again.'],
      }))
    } finally {
      setValidation(prev => ({ ...prev, isSubmitting: false }))
    }
  }, [validate, onSubmit])

  // Reset form
  const reset = useCallback((newValues?: T) => {
    const resetValues = newValues || (initialValues as T)
    setValues(resetValues)
    setValidation({
      isValid: false,
      errors: [],
      isDirty: false,
      isSubmitting: false,
    })
  }, [initialValues])

  // Set specific field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setValidation(prev => ({
      ...prev,
      errors: [...prev.errors.filter(e => !e.includes(String(field))), `${String(field)}: ${error}`],
    }))
  }, [])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setValidation(prev => ({ ...prev, errors: [] }))
  }, [])

  // Get field-specific error
  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return validation.errors.find(error => error.startsWith(`${String(field)}:`))
  }, [validation.errors])

  // Check if field has error
  const hasFieldError = useCallback((field: keyof T): boolean => {
    return !!getFieldError(field)
  }, [getFieldError])

  // Initial validation
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      validate()
    }
  }, []) // Only run once on mount

  return {
    // Form state
    values,
    setValues,

    // Validation state
    isValid: validation.isValid,
    errors: validation.errors,
    isDirty: validation.isDirty,
    isSubmitting: validation.isSubmitting,

    // Field helpers
    getFieldError,
    hasFieldError,
    setFieldError,

    // Form handlers
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    clearErrors,

    // Utility
    validate,
  }
}

// Hook for validating individual fields
export function useFieldValidation<T>(
  name: string,
  value: T,
  rules: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp },
) {
  const [error, setError] = useState<string | undefined>()
  const [isTouched, setIsTouched] = useState(false)

  const validateField = useCallback((fieldValue: T) => {
    const schema: ValidationSchema = {
      [name]: {
        required: rules.required,
        minLength: rules.minLength,
        maxLength: rules.maxLength,
        pattern: rules.pattern,
      },
    }

    const result = validateInput({ [name]: fieldValue }, schema)
    const fieldError = result.errors.find(e => e.includes(`${name}:`))
    setError(fieldError)
    return result.isValid
  }, [name, rules])

  const handleChange = useCallback((newValue: T) => {
    if (isTouched) {
      validateField(newValue)
    }
    return newValue
  }, [isTouched, validateField])

  const handleBlur = useCallback(() => {
    setIsTouched(true)
    validateField(value)
  }, [value, validateField])

  return {
    error,
    isValid: !error,
    isTouched,
    handleChange,
    handleBlur,
    validate: validateField,
  }
}

// Hook for async validation (e.g., checking if email exists)
export function useAsyncValidation<T>(
  validator: (value: T) => Promise<boolean | string>,
  debounceMs: number = 500,
) {
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const validateAsync = useCallback(async (value: T): Promise<boolean> => {
    setIsValidating(true)
    setError(undefined)

    try {
      const timeoutId = setTimeout(async () => {
        try {
          const result = await validator(value)
          if (result !== true) {
            setError(typeof result === 'string' ? result : 'Validation failed')
          }
        } catch (err) {
          setError('Validation error occurred')
        } finally {
          setIsValidating(false)
        }
      }, debounceMs)

      return () => clearTimeout(timeoutId)
    } catch (err) {
      setIsValidating(false)
      setError('Validation error occurred')
      return false
    }
  }, [validator, debounceMs])

  return {
    isValidating,
    error,
    validateAsync,
  }
}

export default useValidation
