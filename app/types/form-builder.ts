export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export type FormField = {
  id: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "checkbox-group"
    | "radio";
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    customMessage?: string;
  };
};

export type FormState = {
  fields: FormField[];
  title: string;
  description?: string;
};

export type FormValidationState = {
  success: boolean;
  message?: string;
  errors?: ValidationError[];
};
