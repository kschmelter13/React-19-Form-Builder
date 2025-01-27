import { FormField } from "../../types/form-builder";

type ServerActionOptions = {
  languageType: "typescript" | "javascript";
  actionName?: string;
};

export function generateServerAction(
  fields: FormField[],
  options: ServerActionOptions
) {
  const { languageType, actionName = "submitForm" } = options;

  const typeAnnotations =
    languageType === "typescript"
      ? {
          params: "(prevState: any, formData: FormData)",
          returnType:
            ": Promise<{ formData: FormData | null; errors: Array<{ field: string; message: string }>; success?: boolean; data?: any }>",
        }
      : {
          params: "(prevState, formData)",
          returnType: "",
        };

  return `async function ${actionName}${typeAnnotations.params}${
    typeAnnotations.returnType
  } {
  // To use server actions you need to import the function from a separate file
  // 'use server';

  const validationResult = validateForm(formData);
  
  if (!validationResult.isValid) {
    return {
      formData,
      errors: validationResult.errors
    };
  }

  // Process form data here
  const data = Object.fromEntries(formData);
  
  // You can access individual fields using formData.get():
${fields
  .map((field) => `  // const ${field.name} = formData.get('${field.name}');`)
  .join("\n")}

  // Add your form processing logic here
  // For example, save to a database, send an email, etc.
  console.log('Form submitted successfully:', data);
  
  return {
    formData: null,
    errors: [],
    success: true,
    data
  };
}`;
}
