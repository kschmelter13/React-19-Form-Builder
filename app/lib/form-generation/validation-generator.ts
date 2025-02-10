import { FormField } from "../../types/form-builder";

export function generateValidationTypes(
  languageType: "typescript" | "javascript"
) {
  if (languageType === "javascript") return "";

  return `type ValidationError = {
  field: string;
  message: string;
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

`;
}

export function generateValidationFunction(
  fields: FormField[],
  languageType: "typescript" | "javascript"
) {
  const escapeString = (str: string) => {
    const escaped = str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    return escaped;
  };

  return `function validateForm(formData${
    languageType === "typescript" ? ": FormData" : ""
  })${languageType === "typescript" ? ": ValidationResult" : ""} {
  const errors${languageType === "typescript" ? ": ValidationError[]" : ""} = [];
${fields
  .map((field) => {
    const validation = field.validation || {};

    const checks = [];
    const hasValidation =
      validation.required ||
      field.type === "email" ||
      (field.type === "number" &&
        (validation.min !== undefined || validation.max !== undefined)) ||
      ((field.type === "text" ||
        field.type === "textarea" ||
        field.type === "password") &&
        (validation.minLength !== undefined ||
          validation.maxLength !== undefined ||
          validation.pattern));

    if (!hasValidation) return "";

    const varName = field.name.replace(/-/g, "_");
    checks.push(`  const ${varName} = formData.get('${field.name}');`);

    if (validation.required) {
      if (field.type === "select" || field.type === "radio") {
        checks.push(`
  if (!${varName} || ${varName}.toString().trim() === '') {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage ||
          `Please select ${
            field.type === "select" ? "a value" : "an option"
          } for ${field.label}`
      )}'
    });
  }`);
      } else if (field.type === "checkbox") {
        checks.push(`
  if (!${varName}) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage || `${field.label} must be checked`
      )}'
    });
  }`);
      } else if (field.type === "checkbox-group") {
        checks.push(`
  const ${varName}_values = formData.getAll('${field.name}');
  if (!${varName}_values || ${varName}_values.length === 0) {
    errors.push({ field: '${field.name}', message: 'Please select at least one option for ${field.label}' });
  }`);
      } else {
        checks.push(`
  if (!${varName} || ${varName}.toString().trim() === '') {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage || `${field.label} is required`
      )}'
    });
  }`);
      }
    }

    if (field.type === "email") {
      checks.push(`
  if (${varName} && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(${varName}.toString())) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage || "Please enter a valid email address"
      )}'
    });
  }`);
    }

    if (field.type === "number") {
      if (validation.min !== undefined) {
        checks.push(`
  if (${varName} && Number(${varName}) < ${validation.min}) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage ||
          `${field.label} must be at least ${validation.min}`
      )}'
    });
  }`);
      }
      if (validation.max !== undefined) {
        checks.push(`
  if (${varName} && Number(${varName}) > ${validation.max}) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage ||
          `${field.label} must be at most ${validation.max}`
      )}'
    });
  }`);
      }
    }

    if (
      (field.type === "text" ||
        field.type === "textarea" ||
        field.type === "password") &&
      validation.minLength !== undefined
    ) {
      checks.push(`
  if (${varName} && ${varName}.toString().length < ${validation.minLength}) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage ||
          `${field.label} must be at least ${validation.minLength} characters`
      )}'
    });
  }`);
    }

    if (
      (field.type === "text" ||
        field.type === "textarea" ||
        field.type === "password") &&
      validation.maxLength !== undefined
    ) {
      checks.push(`
  if (${varName} && ${varName}.toString().length > ${validation.maxLength}) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage ||
          `${field.label} must be at most ${validation.maxLength} characters`
      )}'
    });
  }`);
    }

    if (
      (field.type === "text" ||
        field.type === "textarea" ||
        field.type === "password") &&
      validation.pattern
    ) {
      checks.push(`
  if (${varName} && !new RegExp(${JSON.stringify(
    validation.pattern
  )}).test(${varName}.toString())) {
    errors.push({
      field: '${field.name}',
      message: '${escapeString(
        validation.customMessage || `${field.label} format is invalid`
      )}'
    });
  }`);
    }

    return checks.join("\n");
  })
  .filter(Boolean)
  .join("\n")}

  return {
    isValid: errors.length === 0,
    errors
  };
}`;
}
