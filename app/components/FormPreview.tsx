'use client';

import { useState } from 'react';
import { FormField, ValidationError } from '../types/form-builder';
import { validateForm } from '../lib/validation';

export function FormPreview({ fields }: { fields: FormField[] }) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationResult = validateForm(fields, formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setErrors([]);
    // Form is valid - implement your form submission logic here
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
      {fields.map((field) => {
        const error = getFieldError(field.name);
        
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  error ? 'border-red-500' : ''
                }`}
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  error ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  className={`h-4 w-4 text-black focus:ring-black border-gray-300 rounded ${
                    error ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                  {field.label}
                </label>
              </div>
            ) : field.type === 'checkbox-group' ? (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field.name}-${option.value}`}
                      name={field.name}
                      value={option.value}
                      className={`h-4 w-4 text-black focus:ring-black border-gray-300 rounded ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    <label
                      htmlFor={`${field.name}-${option.value}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : field.type === 'radio' ? (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`${field.name}-${option.value}`}
                      name={field.name}
                      value={option.value}
                      className={`h-4 w-4 text-black focus:ring-black border-gray-300 ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    <label
                      htmlFor={`${field.name}-${option.value}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  error ? 'border-red-500' : ''
                }`}
              />
            )}
            
            {error && (
              <p className="text-sm text-red-500 mt-1">{error.message}</p>
            )}
          </div>
        );
      })}
      
      <div className="flex flex-col gap-4">   
        <button
          type="submit"
          className="w-auto min-w-[120px] px-5 py-2.5 text-white bg-black rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
} 