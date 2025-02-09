'use client';

import { useActionState } from 'react';

type ValidationError = {
  field: string;
  message: string;
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

function validateForm(formData: FormData): ValidationResult {
  const errors = [];
  const checkbox_group2 = formData.get('checkbox-group2');

  const checkbox_group2_values = formData.getAll('checkbox-group2');
  if (!checkbox_group2_values || checkbox_group2_values.length === 0) {
    errors.push({ field: 'checkbox-group2', message: 'Please select at least one option for Email Address' });
  }
  const textarea3 = formData.get('textarea3');

  if (textarea3 && !new RegExp("^[A-Z][a-z]+$").test(textarea3.toString())) {
    errors.push({
      field: 'textarea3',
      message: 'Company format is invalid'
    });
  }
  const text4 = formData.get('text4');

  if (text4 && text4.toString().length < 6) {
    errors.push({
      field: 'text4',
      message: 'Website must be at least 6 characters'
    });
  }

  if (text4 && text4.toString().length > 10) {
    errors.push({
      field: 'text4',
      message: 'Website must be at most 10 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function submitForm(prevState: any, formData: FormData): Promise<{ formData: FormData | null; errors: Array<{ field: string; message: string }>; success?: boolean; data?: any }> {
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
  // const radio1 = formData.get('radio1');
  // const checkbox-group2 = formData.get('checkbox-group2');
  // const textarea3 = formData.get('textarea3');
  // const text4 = formData.get('text4');
  // const radio5 = formData.get('radio5');

  // Add your form processing logic here
  // For example, save to a database, send an email, etc.
  console.log('Form submitted successfully:', data);
  
  return {
    formData: null,
    errors: [],
    success: true,
    data
  };
}
//
export default function GeneratedForm() {
  const [state, formAction] = useActionState(submitForm, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">React 19 Form Builder</h1>
        <p className="text-gray-600">Build type-safe forms with Server Actions and useActionState</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="radio1" className="block text-sm font-medium mb-1.5">
          Job Title
        </label>
                <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="radio1"
              id="radio1-option1"
              value="option1"
              defaultChecked={state?.formData?.get('radio1') === 'option1'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio1-option1"
              className="ml-2 text-sm"
            >
              Option 1
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="radio1"
              id="radio1-option2"
              value="option2"
              defaultChecked={state?.formData?.get('radio1') === 'option2'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio1-option2"
              className="ml-2 text-sm"
            >
              Option 2
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="radio1"
              id="radio1-option3"
              value="option3"
              defaultChecked={state?.formData?.get('radio1') === 'option3'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio1-option3"
              className="ml-2 text-sm"
            >
              Option 3
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="radio1"
              id="radio1-option4"
              value="option4"
              defaultChecked={state?.formData?.get('radio1') === 'option4'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio1-option4"
              className="ml-2 text-sm"
            >
              Option 4
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="radio1"
              id="radio1-option5"
              value="option5"
              defaultChecked={state?.formData?.get('radio1') === 'option5'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio1-option5"
              className="ml-2 text-sm"
            >
              Option 5
            </label>
          </div>
        </div>
        {state?.errors?.find(error => error.field === 'radio1') && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.find(error => error.field === 'radio1')?.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="checkbox-group2" className="block text-sm font-medium mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
                <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="checkbox-group2"
              id="checkbox-group2-option1"
              value="option1"
              defaultChecked={state?.formData?.getAll('checkbox-group2')?.includes('option1')}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black rounded"
            />
            <label
              htmlFor="checkbox-group2-option1"
              className="ml-2 text-sm"
            >
              Option 1
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="checkbox-group2"
              id="checkbox-group2-option2"
              value="option2"
              defaultChecked={state?.formData?.getAll('checkbox-group2')?.includes('option2')}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black rounded"
            />
            <label
              htmlFor="checkbox-group2-option2"
              className="ml-2 text-sm"
            >
              Option 2
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="checkbox-group2"
              id="checkbox-group2-option3"
              value="option3"
              defaultChecked={state?.formData?.getAll('checkbox-group2')?.includes('option3')}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black rounded"
            />
            <label
              htmlFor="checkbox-group2-option3"
              className="ml-2 text-sm"
            >
              Option 3
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="checkbox-group2"
              id="checkbox-group2-option4"
              value="option4"
              defaultChecked={state?.formData?.getAll('checkbox-group2')?.includes('option4')}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black rounded"
            />
            <label
              htmlFor="checkbox-group2-option4"
              className="ml-2 text-sm"
            >
              Option 4
            </label>
          </div>
        </div>
        {state?.errors?.find(error => error.field === 'checkbox-group2') && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.find(error => error.field === 'checkbox-group2')?.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="textarea3" className="block text-sm font-medium mb-1.5">
          Company
        </label>
                <textarea
          name="textarea3"
          id="textarea3"
          placeholder="Enter company..."
          defaultValue={state?.formData?.get('textarea3')?.toString() || ''}
          className="w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          rows={4}
        />
        {state?.errors?.find(error => error.field === 'textarea3') && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.find(error => error.field === 'textarea3')?.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="text4" className="block text-sm font-medium mb-1.5">
          Website
        </label>
                <input
          type="text"
          name="text4"
          id="text4"
          placeholder="Enter website..."
          defaultValue={state?.formData?.get('text4')?.toString() || ''}
          className="w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors"
        />
        {state?.errors?.find(error => error.field === 'text4') && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.find(error => error.field === 'text4')?.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="radio5" className="block text-sm font-medium mb-1.5">
          Website
        </label>
                <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="radio5"
              id="radio5-option1"
              value="option1"
              defaultChecked={state?.formData?.get('radio5') === 'option1'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio5-option1"
              className="ml-2 text-sm"
            >
              Option 1
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="radio5"
              id="radio5-option2"
              value="option2"
              defaultChecked={state?.formData?.get('radio5') === 'option2'}
              className="h-4 w-4 text-black border-gray-300 focus:ring-black"
            />
            <label
              htmlFor="radio5-option2"
              className="ml-2 text-sm"
            >
              Option 2
            </label>
          </div>
        </div>
        {state?.errors?.find(error => error.field === 'radio5') && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.find(error => error.field === 'radio5')?.message}
          </p>
        )}
      </div>
      
      {state?.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">Form submitted successfully!</p>
        </div>
      )}
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}