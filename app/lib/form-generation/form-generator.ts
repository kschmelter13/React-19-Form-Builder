import { FormState } from "../../types/form-builder";
import { generateInputCode } from "./input-generator";
import {
  generateValidationTypes,
  generateValidationFunction,
} from "./validation-generator";
import { generateServerAction } from "./server-action-generator";

type GenerateFormOptions = {
  styleType: "tailwind" | "css";
  languageType: "typescript" | "javascript";
};

export function generateFormCode(
  formState: FormState,
  options: GenerateFormOptions
) {
  const { styleType, languageType } = options;

  const imports = `'use client';

import { useActionState } from 'react';\n`;

  const validationTypes = generateValidationTypes(languageType);
  const validationFunction = generateValidationFunction(
    formState.fields,
    languageType
  );

  const formFields = formState.fields
    .map((field) => generateInputCode(field, styleType))
    .join("\n\n");

  const serverAction = generateServerAction(formState.fields, { languageType });

  const formStyles = {
    form: {
      maxWidth: "42rem",
      margin: "0 auto",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    description: {
      color: "#4B5563",
    },
    successMessage: {
      padding: "1rem",
      backgroundColor: "#F0FDF4",
      border: "1px solid #BBF7D0",
      borderRadius: "0.375rem",
    },
    successText: {
      fontSize: "0.875rem",
      color: "#166534",
    },
    submitButton: {
      width: "100%",
      padding: "0.5rem 1rem",
      color: "white",
      backgroundColor: "black",
      borderRadius: "0.375rem",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "#1F2937",
      },
      ":focus": {
        outline: "none",
        ringWidth: "2px",
        ringColor: "black",
        ringOffset: "2px",
      },
    },
  };

  const formComponent = `export default function GeneratedForm() {
  const [state, formAction] = useActionState(submitForm, null);

  return (
    <form action={formAction} ${
      styleType === "tailwind"
        ? 'className="space-y-6 max-w-2xl mx-auto p-6"'
        : `style={${JSON.stringify(formStyles.form)}}`
    }>
      <div ${
        styleType === "tailwind"
          ? 'className="space-y-4"'
          : `style={${JSON.stringify(formStyles.header)}}`
      }>
        <h1 ${
          styleType === "tailwind"
            ? 'className="text-2xl font-bold"'
            : `style={${JSON.stringify(formStyles.title)}}`
        }>${formState.title}</h1>
        <p ${
          styleType === "tailwind"
            ? 'className="text-gray-600"'
            : `style={${JSON.stringify(formStyles.description)}}`
        }>${formState.description}</p>
      </div>

${formFields}
      
      {state?.success && (
        <div ${
          styleType === "tailwind"
            ? 'className="p-4 bg-green-50 border border-green-200 rounded-md"'
            : `style={${JSON.stringify(formStyles.successMessage)}}`
        }>
          <p ${
            styleType === "tailwind"
              ? 'className="text-sm text-green-800"'
              : `style={${JSON.stringify(formStyles.successText)}}`
          }>Form submitted successfully!</p>
        </div>
      )}
      
      <button
        type="submit"
        ${
          styleType === "tailwind"
            ? 'className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"'
            : `style={${JSON.stringify(formStyles.submitButton)}}`
        }
      >
        Submit
      </button>
    </form>
  );
}\n`;

  // Combine all parts with proper spacing
  const code = [
    imports.trim(),
    validationTypes.trim(),
    validationFunction.trim(),
    serverAction.trim(),
    formComponent.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");

  // Format the final code
  return code;
}
