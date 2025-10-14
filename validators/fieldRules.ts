/**
 * Field Validation Rules for Broker Data Verification
 * Defines validation patterns, ranges, and normalization rules for each data field
 */

export interface ValidationRule {
  fieldName: string;
  dataType: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  pattern?: RegExp;
  minValue?: number;
  maxValue?: number;
  allowedValues?: any[];
  minLength?: number;
  maxLength?: number;
  tolerance?: number; // For numerical comparisons
  normalizer?: (value: any) => any;
  validator?: (value: any) => { isValid: boolean; message?: string };
  category: 'core' | 'financial' | 'regulatory' | 'technical' | 'optional';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface FieldComparisonResult {
  fieldName: string;
  dbValue: any;
  webValue: any;
  normalizedDbValue: any;
  normalizedWebValue: any;
  isMatch: boolean;
  difference?: number | string;
  toleranceExceeded: boolean;
  confidence: number;
  issues: string[];
}

export class FieldValidator {
  private static rules: ValidationRule[] = [
    // Core Identity Fields
    {
      fieldName: 'name',
      dataType: 'string',
      required: true,
      minLength: 2,
      maxLength: 255,
      category: 'core',
      priority: 'critical',
      normalizer: (value: string) => value?.trim().toLowerCase().replace(/[^\w\s]/g, ''),
      validator: (value: string) => {
        if (!value || value.length < 2) return { isValid: false, message: 'Broker name too short' };
        return { isValid: true };
      }
    },

    {
      fieldName: 'websiteUrl',
      dataType: 'string',
      required: true,
      pattern: /^https?:\/\/.+\..+/i,
      category: 'core',
      priority: 'high',
      normalizer: (value: string) => value?.toLowerCase().replace(/\/+$/, ''),
      validator: (value: string) => {
        if (!/^https?:\/\/.+\..+/i.test(value || '')) return { isValid: false, message: 'Invalid URL format' };
        return { isValid: true };
      }
    },

    {
      fieldName: 'foundingYear',
      dataType: 'number',
      required: true,
      minValue: 1900,
      maxValue: new Date().getFullYear(),
      tolerance: 1,
      category: 'core',
      priority: 'high',
      validator: (value: number) => {
        const currentYear = new Date().getFullYear();
        const isValid = value >= 1900 && value <= currentYear;
        return {
          isValid,
          message: isValid ? undefined : `Founding year must be between 1900 and ${currentYear}`
        };
      }
    },

    {
      fieldName: 'headquarters',
      dataType: 'string',
      required: true,
      minLength: 3,
      maxLength: 255,
      category: 'core',
      priority: 'medium',
      normalizer: (value: string) => value?.trim().replace(/[.,]/g, '').toLowerCase()
    },

    // Financial Fields
    {
      fieldName: 'minDeposit',
      dataType: 'number',
      required: true,
      minValue: 0,
      maxValue: 50000,
      tolerance: 50, // $50 tolerance
      category: 'financial',
      priority: 'high',
      validator: (value: number) => {
        if (value < 0) return { isValid: false, message: 'Minimum deposit cannot be negative' };
        if (value > 50000) return { isValid: false, message: 'Minimum deposit seems unusually high' };
        return { isValid: true };
      }
    },

    {
      fieldName: 'eurUsdSpread',
      dataType: 'number',
      required: true,
      minValue: 0,
      maxValue: 10,
      tolerance: 0.5, // 0.5 pips tolerance
      category: 'financial',
      priority: 'high',
      validator: (value: number) => ({
        isValid: value >= 0 && value <= 10,
        message: value < 0 ? 'Spread cannot be negative' :
                 value > 10 ? 'Spread seems unusually high' : undefined
      })
    },

    {
      fieldName: 'maxLeverage',
      dataType: 'string',
      required: true,
      pattern: /^1:\d+$/,
      category: 'financial',
      priority: 'medium',
      normalizer: (value: string) => value?.replace(/\s+/g, '').toLowerCase(),
      validator: (value: string) => {
        const match = value?.match(/^1:(\d+)$/);
        if (!match) return { isValid: false, message: 'Invalid leverage format (should be 1:XXX)' };
        
        const leverageRatio = parseInt(match[1]);
        const isValid = leverageRatio >= 1 && leverageRatio <= 2000;
        return {
          isValid,
          message: isValid ? undefined : 'Leverage ratio should be between 1:1 and 1:2000'
        };
      }
    },

    // Regulatory Fields
    {
      fieldName: 'regulators',
      dataType: 'array',
      required: true,
      minLength: 1,
      maxLength: 20,
      category: 'regulatory',
      priority: 'critical',
      allowedValues: [
        'FCA', 'ASIC', 'CySEC', 'ESMA', 'FSA', 'FINRA', 'SEC', 'CFTC', 'NFA',
        'BaFin', 'AMF', 'CONSOB', 'AFM', 'DFSA', 'FSCA', 'CMA', 'CBB', 'CBUAE',
        'JFSA', 'FSC', 'SFC', 'MAS', 'CSA', 'IIROC', 'OSC', 'SRO'
      ],
      normalizer: (value: string[]) => 
        value?.map(reg => reg.toUpperCase().trim()).sort(),
      validator: (value: string[]) => ({
        isValid: Array.isArray(value) && value.length > 0,
        message: !Array.isArray(value) ? 'Regulators must be an array' :
                 value.length === 0 ? 'At least one regulator required' : undefined
      })
    },

    // Technical/Platform Fields
    {
      fieldName: 'platforms',
      dataType: 'array',
      required: true,
      minLength: 1,
      maxLength: 10,
      category: 'technical',
      priority: 'medium',
      allowedValues: [
        'MetaTrader 4', 'MetaTrader 5', 'MT4', 'MT5', 'cTrader', 'TradingView',
        'NinjaTrader', 'ProRealTime', 'Web Platform', 'Mobile App', 'Desktop App',
        'Proprietary Platform', 'API', 'FIX', 'Multi-Asset Platform'
      ],
      normalizer: (value: string[]) => 
        value?.map(platform => platform.trim()).sort()
    },

    {
      fieldName: 'score',
      dataType: 'number',
      required: true,
      minValue: 1,
      maxValue: 10,
      tolerance: 0.5,
      category: 'optional',
      priority: 'medium',
      validator: (value: number) => ({
        isValid: value >= 1 && value <= 10,
        message: value < 1 || value > 10 ? 'Score must be between 1 and 10' : undefined
      })
    },

    // Additional validation rules for complex fields
    {
      fieldName: 'description',
      dataType: 'string',
      required: true,
      minLength: 50,
      maxLength: 2000,
      category: 'optional',
      priority: 'low',
      validator: (value: string) => {
        if (!value || value.length < 50) return { isValid: false, message: 'Description too short (minimum 50 characters)' };
        return { isValid: true };
      }
    },

    {
      fieldName: 'logoUrl',
      dataType: 'string',
      required: true,
      pattern: /\.(png|jpg|jpeg|svg|gif)$/i,
      category: 'optional',
      priority: 'low',
      validator: (value: string) => {
        if (!/\.(png|jpg|jpeg|svg|gif)$/i.test(value || '')) return { isValid: false, message: 'Logo URL must point to a valid image file' };
        return { isValid: true };
      }
    }
  ];

  /**
   * Gets validation rule for a specific field
   */
  public static getFieldRule(fieldName: string): ValidationRule | undefined {
    return this.rules.find(rule => rule.fieldName === fieldName);
  }

  /**
   * Gets all validation rules by category
   */
  public static getRulesByCategory(category: ValidationRule['category']): ValidationRule[] {
    return this.rules.filter(rule => rule.category === category);
  }

  /**
   * Gets all critical validation rules
   */
  public static getCriticalRules(): ValidationRule[] {
    return this.rules.filter(rule => rule.priority === 'critical');
  }

  /**
   * Validates a single field value
   */
  public static validateField(fieldName: string, value: any): {
    isValid: boolean;
    normalizedValue: any;
    errors: string[];
    warnings: string[];
  } {
    const rule = this.getFieldRule(fieldName);
    if (!rule) {
      return {
        isValid: true,
        normalizedValue: value,
        errors: [],
        warnings: [`No validation rule found for field: ${fieldName}`]
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Normalize value if normalizer is provided
    const normalizedValue = rule.normalizer ? rule.normalizer(value) : value;

    // Required field check
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors.push(`Field ${fieldName} is required`);
      return { isValid: false, normalizedValue, errors, warnings };
    }

    // Type validation
    if (value !== null && value !== undefined) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.dataType) {
        errors.push(`Field ${fieldName} must be of type ${rule.dataType}, got ${actualType}`);
      }
    }

    // Pattern validation for strings
    if (rule.pattern && typeof normalizedValue === 'string') {
      if (!rule.pattern.test(normalizedValue)) {
        errors.push(`Field ${fieldName} does not match required pattern`);
      }
    }

    // Range validation for numbers
    if (typeof normalizedValue === 'number') {
      if (rule.minValue !== undefined && normalizedValue < rule.minValue) {
        errors.push(`Field ${fieldName} must be at least ${rule.minValue}`);
      }
      if (rule.maxValue !== undefined && normalizedValue > rule.maxValue) {
        errors.push(`Field ${fieldName} must be at most ${rule.maxValue}`);
      }
    }

    // Length validation for strings and arrays
    if (typeof normalizedValue === 'string' || Array.isArray(normalizedValue)) {
      const length = normalizedValue.length;
      if (rule.minLength !== undefined && length < rule.minLength) {
        errors.push(`Field ${fieldName} must have at least ${rule.minLength} ${typeof normalizedValue === 'string' ? 'characters' : 'items'}`);
      }
      if (rule.maxLength !== undefined && length > rule.maxLength) {
        errors.push(`Field ${fieldName} must have at most ${rule.maxLength} ${typeof normalizedValue === 'string' ? 'characters' : 'items'}`);
      }
    }

    // Allowed values validation
    if (rule.allowedValues && Array.isArray(normalizedValue)) {
      const invalidValues = normalizedValue.filter(v => !rule.allowedValues!.includes(v));
      if (invalidValues.length > 0) {
        warnings.push(`Field ${fieldName} contains unrecognized values: ${invalidValues.join(', ')}`);
      }
    }

    // Custom validator
    if (rule.validator) {
      const customResult = rule.validator(normalizedValue);
      if (!customResult.isValid && customResult.message) {
        errors.push(customResult.message);
      }
    }

    return {
      isValid: errors.length === 0,
      normalizedValue,
      errors,
      warnings
    };
  }

  /**
   * Compares two field values and determines if they match within tolerance
   */
  public static compareFieldValues(
    fieldName: string, 
    dbValue: any, 
    webValue: any
  ): FieldComparisonResult {
    const rule = this.getFieldRule(fieldName);
    const issues: string[] = [];

    // Normalize both values
    const normalizedDbValue = rule?.normalizer ? rule.normalizer(dbValue) : dbValue;
    const normalizedWebValue = rule?.normalizer ? rule.normalizer(webValue) : webValue;

    let isMatch = false;
    let difference: number | string | undefined;
    let toleranceExceeded = false;
    let confidence = 0.5; // Base confidence

    // Handle null/undefined values
    if (normalizedDbValue === null || normalizedDbValue === undefined) {
      if (normalizedWebValue === null || normalizedWebValue === undefined) {
        isMatch = true;
        confidence = 0.9;
      } else {
        issues.push('Database value is missing');
        confidence = 0.1;
      }
    } else if (normalizedWebValue === null || normalizedWebValue === undefined) {
      issues.push('Web value is missing');
      confidence = 0.3;
    } else {
      // Type-specific comparison logic
      if (typeof normalizedDbValue === 'number' && typeof normalizedWebValue === 'number') {
        difference = Math.abs(normalizedDbValue - normalizedWebValue);
        const tolerance = rule?.tolerance || 0;
        
        isMatch = difference <= tolerance;
        toleranceExceeded = difference > tolerance;
        
        // Calculate confidence based on difference
        if (difference === 0) {
          confidence = 1.0;
        } else if (difference <= tolerance) {
          confidence = 0.9 - (difference / tolerance) * 0.3;
        } else {
          confidence = 0.4 - Math.min(difference / tolerance, 2) * 0.2;
        }
        
      } else if (typeof normalizedDbValue === 'string' && typeof normalizedWebValue === 'string') {
        isMatch = normalizedDbValue === normalizedWebValue;
        
        if (!isMatch) {
          // Calculate string similarity
          const similarity = this.calculateStringSimilarity(normalizedDbValue, normalizedWebValue);
          confidence = similarity * 0.8;
          
          if (similarity > 0.8) {
            issues.push('Values are similar but not identical');
          } else if (similarity > 0.5) {
            issues.push('Values have moderate similarity');
          } else {
            issues.push('Values are significantly different');
          }
        } else {
          confidence = 1.0;
        }
        
      } else if (Array.isArray(normalizedDbValue) && Array.isArray(normalizedWebValue)) {
        // Array comparison
        const intersection = normalizedDbValue.filter(v => normalizedWebValue.includes(v));
        const union = [...new Set([...normalizedDbValue, ...normalizedWebValue])];
        
        const similarity = union.length > 0 ? intersection.length / union.length : 0;
        isMatch = similarity >= 0.8; // 80% similarity considered a match
        confidence = similarity * 0.9;
        
        if (similarity < 0.8) {
          issues.push(`Arrays have ${Math.round(similarity * 100)}% similarity`);
        }
        
      } else {
        // Generic comparison
        isMatch = normalizedDbValue === normalizedWebValue;
        confidence = isMatch ? 1.0 : 0.2;
        
        if (!isMatch) {
          issues.push('Values are different');
        }
      }
    }

    // Adjust confidence based on field priority
    if (rule?.priority === 'critical') {
      confidence *= 1.1; // Boost confidence for critical fields
    } else if (rule?.priority === 'low') {
      confidence *= 0.9; // Reduce confidence for low priority fields
    }

    // Ensure confidence stays within bounds
    confidence = Math.max(0, Math.min(1, confidence));

    const result: FieldComparisonResult = {
      fieldName,
      dbValue,
      webValue,
      normalizedDbValue,
      normalizedWebValue,
      isMatch,
      toleranceExceeded,
      confidence,
      issues
    };
    
    if (difference !== undefined) {
      result.difference = difference;
    }
    
    return result;
  }

  /**
   * Calculates string similarity using Levenshtein distance
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array.from({ length: str2.length + 1 }, () => 
      Array.from({ length: str1.length + 1 }, () => 0)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0]![i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j]![0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j]![i] = Math.min(
          matrix[j]![i - 1]! + 1, // deletion
          matrix[j - 1]![i]! + 1, // insertion
          matrix[j - 1]![i - 1]! + substitutionCost // substitution
        );
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  /**
   * Gets all field validation rules
   */
  public static getAllRules(): ValidationRule[] {
    return [...this.rules];
  }

  /**
   * Adds a custom validation rule
   */
  public static addCustomRule(rule: ValidationRule): void {
    const existingIndex = this.rules.findIndex(r => r.fieldName === rule.fieldName);
    if (existingIndex >= 0) {
      this.rules[existingIndex] = rule;
    } else {
      this.rules.push(rule);
    }
  }
}

// Export field validator singleton
export const fieldValidator = FieldValidator;