'use client';

import { FormField } from '../types/form-builder';

const AVAILABLE_FIELDS: Omit<FormField, 'id' | 'name'>[] = [
  {
    type: 'text',
    label: 'Text Input',
    placeholder: 'Enter text...',
  },
  {
    type: 'email',
    label: 'Email Input',
    placeholder: 'Enter email...',
  },
  {
    type: 'password',
    label: 'Password Input',
    placeholder: 'Enter password...',
  },
  {
    type: 'textarea',
    label: 'Text Area',
    placeholder: 'Enter long text...',
  },
  {
    type: 'select',
    label: 'Select',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
  },
  {
    type: 'radio',
    label: 'Radio Group',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
];

export function FieldSelector({ onAddField }: { onAddField: (field: FormField) => void }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>
      <div className="grid gap-2">
        {AVAILABLE_FIELDS.map((field) => (
          <button
            key={field.type}
            onClick={() => {
              const newField: FormField = {
                ...field,
                id: `${field.type}-${Date.now()}`,
                name: `${field.type}${Date.now()}`,
                required: false,
              };
              onAddField(newField);
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm bg-black/5 hover:bg-black/10 rounded-md transition-colors"
          >
            <span className="flex-1 font-medium">{field.label}</span>
            <span className="text-xs text-gray-600">{field.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 