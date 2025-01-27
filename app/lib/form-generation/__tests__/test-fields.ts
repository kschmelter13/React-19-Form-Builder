import { FormField } from "../../../types/form-builder";

// Set 1: Basic fields with minimal validation
export const basicFields = {
  text: {
    id: "1",
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "Enter username",
    validation: { required: true },
  } as FormField,

  email: {
    id: "2",
    type: "email",
    name: "email",
    label: "Email Address",
    placeholder: "Enter email",
    validation: { required: true },
  } as FormField,

  number: {
    id: "3",
    type: "number",
    name: "age",
    label: "Age",
    placeholder: "Enter age",
    validation: { required: true },
  } as FormField,

  select: {
    id: "4",
    type: "select",
    name: "country",
    label: "Country",
    validation: { required: true },
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
    ],
  } as FormField,

  radio: {
    id: "5",
    type: "radio",
    name: "gender",
    label: "Gender",
    validation: { required: true },
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  } as FormField,

  checkbox: {
    id: "6",
    type: "checkbox",
    name: "terms",
    label: "Accept Terms",
    validation: { required: true },
  } as FormField,

  checkboxGroup: {
    id: "7",
    type: "checkbox-group",
    name: "interests",
    label: "Interests",
    validation: { required: true },
    options: [
      { value: "sports", label: "Sports" },
      { value: "music", label: "Music" },
      { value: "reading", label: "Reading" },
    ],
  } as FormField,

  textarea: {
    id: "8",
    type: "textarea",
    name: "description",
    label: "Description",
    placeholder: "Enter description",
    validation: { required: true },
  } as FormField,
};

// Set 2: Complex fields with extensive validation
export const complexFields = {
  text: {
    id: "1",
    type: "text",
    name: "full_name",
    label: "Full Legal Name",
    placeholder: "Enter your full name",
    validation: {
      required: true,
      minLength: 5,
      maxLength: 50,
      pattern: "^[a-zA-Z ]+$",
    },
  } as FormField,

  email: {
    id: "2",
    type: "email",
    name: "work_email",
    label: "Work Email",
    placeholder: "Enter work email",
    validation: {
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@company\\.com$",
    },
  } as FormField,

  number: {
    id: "3",
    type: "number",
    name: "experience",
    label: "Years of Experience",
    placeholder: "Enter years",
    validation: {
      required: true,
      min: 0,
      max: 50,
    },
  } as FormField,

  select: {
    id: "4",
    type: "select",
    name: "department",
    label: "Department",
    validation: { required: true },
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
      { value: "sales", label: "Sales" },
      { value: "hr", label: "Human Resources" },
    ],
  } as FormField,

  radio: {
    id: "5",
    type: "radio",
    name: "employment_type",
    label: "Employment Type",
    validation: { required: true },
    options: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract" },
    ],
  } as FormField,

  checkbox: {
    id: "6",
    type: "checkbox",
    name: "privacy_policy",
    label: "I have read and agree to the Privacy Policy",
    validation: { required: true },
  } as FormField,

  checkboxGroup: {
    id: "7",
    type: "checkbox-group",
    name: "skills",
    label: "Technical Skills",
    validation: { required: true },
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "react", label: "React" },
      { value: "node", label: "Node.js" },
      { value: "python", label: "Python" },
    ],
  } as FormField,

  textarea: {
    id: "8",
    type: "textarea",
    name: "cover_letter",
    label: "Cover Letter",
    placeholder: "Tell us about yourself",
    validation: {
      required: true,
      minLength: 100,
      maxLength: 1000,
    },
  } as FormField,
};

// Set 3: Multi-language fields with special characters
export const multiLanguageFields = {
  text: {
    id: "1",
    type: "text",
    name: "nombre",
    label: "Nombre Completo",
    placeholder: "Ingrese su nombre",
    validation: {
      required: true,
      minLength: 2,
      maxLength: 30,
    },
  } as FormField,

  email: {
    id: "2",
    type: "email",
    name: "correo",
    label: "Correo Electrónico",
    placeholder: "Ingrese correo",
    validation: { required: true },
  } as FormField,

  number: {
    id: "3",
    type: "number",
    name: "edad",
    label: "Edad",
    placeholder: "Ingrese edad",
    validation: {
      required: true,
      min: 18,
      max: 65,
    },
  } as FormField,

  select: {
    id: "4",
    type: "select",
    name: "pais",
    label: "País",
    validation: { required: true },
    options: [
      { value: "es", label: "España" },
      { value: "mx", label: "México" },
      { value: "ar", label: "Argentina" },
    ],
  } as FormField,

  radio: {
    id: "5",
    type: "radio",
    name: "genero",
    label: "Género",
    validation: { required: true },
    options: [
      { value: "masculino", label: "Masculino" },
      { value: "femenino", label: "Femenino" },
      { value: "otro", label: "Otro" },
    ],
  } as FormField,

  checkbox: {
    id: "6",
    type: "checkbox",
    name: "terminos",
    label: "Acepto los términos y condiciones",
    validation: { required: true },
  } as FormField,

  checkboxGroup: {
    id: "7",
    type: "checkbox-group",
    name: "intereses",
    label: "Áreas de Interés",
    validation: { required: true },
    options: [
      { value: "tecnologia", label: "Tecnología" },
      { value: "diseno", label: "Diseño" },
      { value: "marketing", label: "Márketing" },
    ],
  } as FormField,

  textarea: {
    id: "8",
    type: "textarea",
    name: "mensaje",
    label: "Mensaje",
    placeholder: "Escriba su mensaje aquí",
    validation: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
  } as FormField,
};
