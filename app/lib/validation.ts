import {
  FormField,
  ValidationError,
  ValidationResult,
} from "../types/form-builder";

function validateField(
  field: FormField,
  value: FormDataEntryValue
): ValidationError | null {
  const validation = field.validation || {};

  // Check required
  if (validation.required && (!value || value.toString().trim() === "")) {
    return {
      field: field.name,
      message: validation.customMessage || `${field.label} is required`,
    };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === "") {
    return null;
  }

  // Type-specific validations
  switch (field.type) {
    case "email":
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === "string" && !emailPattern.test(value)) {
        return {
          field: field.name,
          message:
            validation.customMessage ||
            `${field.label} must be a valid email address`,
        };
      }
      break;

    case "number":
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return {
          field: field.name,
          message:
            validation.customMessage || `${field.label} must be a valid number`,
        };
      }
      if (validation.min !== undefined && numValue < validation.min) {
        return {
          field: field.name,
          message:
            validation.customMessage ||
            `${field.label} must be at least ${validation.min}`,
        };
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return {
          field: field.name,
          message:
            validation.customMessage ||
            `${field.label} must be at most ${validation.max}`,
        };
      }
      break;

    case "text":
    case "textarea":
    case "password":
      if (
        validation.minLength &&
        typeof value === "string" &&
        value.length < validation.minLength
      ) {
        return {
          field: field.name,
          message:
            validation.customMessage ||
            `${field.label} must be at least ${validation.minLength} characters`,
        };
      }
      if (
        validation.maxLength &&
        typeof value === "string" &&
        value.length > validation.maxLength
      ) {
        return {
          field: field.name,
          message:
            validation.customMessage ||
            `${field.label} must be at most ${validation.maxLength} characters`,
        };
      }
      if (validation.pattern) {
        const pattern = new RegExp(validation.pattern);
        if (typeof value === "string" && !pattern.test(value)) {
          return {
            field: field.name,
            message:
              validation.customMessage ||
              `${field.label} has an invalid format`,
          };
        }
      }
      break;
  }

  return null;
}

export function validateForm(
  fields: FormField[],
  formData: FormData
): ValidationResult {
  const errors: ValidationError[] = [];

  fields.forEach((field) => {
    const value = formData.get(field.name);
    if (value === null) {
      errors.push({
        field: field.name,
        message: `${field.label} is required`,
      });
      return;
    }
    const error = validateField(field, value);
    if (error) {
      errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
