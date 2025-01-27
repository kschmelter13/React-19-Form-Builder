import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormField } from "../types/form-builder";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FIELD_TYPES = [
  "text",
  "number",
  "email",
  "password",
  "textarea",
  "select",
  "checkbox",
  "checkbox-group",
  "radio",
] as const;
const SAMPLE_LABELS = [
  "First Name",
  "Last Name",
  "Email Address",
  "Phone Number",
  "Password",
  "Age",
  "Bio",
  "Comments",
  "Description",
  "Address",
  "City",
  "Country",
  "Message",
  "Username",
  "Website",
  "Company",
  "Job Title",
  "Notes",
  "Feedback",
];

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates random options for select and radio fields
 * @returns An array of option objects with label and value
 */
export function generateRandomOptions() {
  const count = getRandomInt(2, 5);
  return Array.from({ length: count }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option${i + 1}`,
  }));
}

/**
 * Generates random validation rules based on field type
 * @param type - The type of the form field
 * @returns A validation object or undefined
 */
export function generateRandomValidation(type: FormField["type"]) {
  const validation: FormField["validation"] = {};

  // 40% chance of being required
  if (Math.random() < 0.4) {
    validation.required = true;
  }

  if (type === "text" || type === "textarea" || type === "password") {
    // 60% chance of having length constraints
    if (Math.random() < 0.6) {
      validation.minLength = getRandomInt(3, 8);
      validation.maxLength = getRandomInt(
        validation.minLength + 4,
        validation.minLength + 12
      );
    }
    // 30% chance of having a pattern
    if (Math.random() < 0.3) {
      const patterns = [
        "^[A-Za-z]+$", // letters only
        "^[A-Za-z0-9]+$", // alphanumeric
        "^[A-Z][a-z]+$", // capitalized
      ];
      validation.pattern = patterns[getRandomInt(0, patterns.length - 1)];
    }
  }

  if (type === "number") {
    // 70% chance of having range constraints
    if (Math.random() < 0.7) {
      validation.min = getRandomInt(0, 50);
      validation.max = getRandomInt(validation.min + 10, validation.min + 100);
    }
  }

  return Object.keys(validation).length > 0 ? validation : undefined;
}

export function generateRandomField(index: number): FormField {
  const type = FIELD_TYPES[getRandomInt(0, FIELD_TYPES.length - 1)];
  const label = SAMPLE_LABELS[getRandomInt(0, SAMPLE_LABELS.length - 1)];
  const name = `${type}${index + 1}`;

  const field: FormField = {
    id: `${type}-${Date.now()}-${index}`,
    type,
    label,
    name,
  };

  if (type === "select" || type === "radio" || type === "checkbox-group") {
    field.options = generateRandomOptions();
  }

  if (type !== "checkbox" && type !== "checkbox-group") {
    field.placeholder = `Enter ${label.toLowerCase()}...`;
  }

  field.validation = generateRandomValidation(type);

  return field;
}

export function generateRandomForm(fieldCount = 5): FormField[] {
  return Array.from({ length: fieldCount }, (_, i) => generateRandomField(i));
}

export { FIELD_TYPES, SAMPLE_LABELS };
