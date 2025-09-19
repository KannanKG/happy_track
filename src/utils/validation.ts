export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmailList = (emails: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!emails.trim()) {
    errors.push('At least one email address is required');
    return { isValid: false, errors };
  }
  
  const emailArray = emails.split(',').map(e => e.trim());
  
  for (const email of emailArray) {
    const result = validateEmail(email);
    if (!result.isValid) {
      errors.push(`Invalid email: ${email}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!startDate) {
    errors.push('Start date is required');
  }
  
  if (!endDate) {
    errors.push('End date is required');
  }
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.push('Start date must be before end date');
    }
    
    const now = new Date();
    if (end > now) {
      errors.push('End date cannot be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!value || !value.trim()) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};