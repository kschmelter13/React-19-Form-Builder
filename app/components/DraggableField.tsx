'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../types/form-builder';
import { useState } from 'react';
import { GripVertical, Trash2, Settings, X } from 'lucide-react';

type ValidationKey = keyof NonNullable<FormField['validation']>;

interface Props {
  field: FormField;
  onDelete: (id: string) => void;
  onUpdate: (field: FormField) => void;
}

export function DraggableField({ field, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleValidationChange = (key: ValidationKey, value: string | number | boolean) => {
    onUpdate({
      ...field,
      validation: {
        ...field.validation,
        [key]: value,
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-lg border shadow-sm mb-4 transition-shadow ${
        isDragging ? 'opacity-75 shadow-md' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center p-4">
        <div 
      {...attributes}
      {...listeners}
          className="flex items-center mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
    >
          <GripVertical size={18} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-medium truncate">{field.label}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {field.type}
            </span>
            {field.validation?.required && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">Name: {field.name}</p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title={isEditing ? "Close settings" : "Field settings"}
          >
            {isEditing ? <X size={18} /> : <Settings size={18} />}
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete field"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="border-t bg-gray-50/50 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={field.name}
                onChange={(e) => onUpdate({ ...field, name: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {(field.type === 'text' || field.type === 'textarea' || field.type === 'number' || field.type === 'email') && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            )}

            {(field.type === 'select' || field.type === 'radio') && (
              <div className="sm:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button
                    type="button"
                    onClick={() => {
                      const options = field.options || [];
                      onUpdate({
                        ...field,
                        options: [...options, { label: `Option ${options.length + 1}`, value: `option${options.length + 1}` }]
                      });
                    }}
                    className="text-xs font-medium text-black hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {(field.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...(field.options || [])];
                          newOptions[index] = {
                            ...option,
                            label: e.target.value,
                            value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                          };
                          onUpdate({ ...field, options: newOptions });
                        }}
                        placeholder="Option label"
                        className="flex-1 px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = [...(field.options || [])];
                          newOptions.splice(index, 1);
                          onUpdate({ ...field, options: newOptions });
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(field.options || []).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No options added yet</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-900 mb-3">Validation Settings</h4>
            
            <div className="space-y-4">
              {field.type !== 'checkbox' && (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.validation?.required || false}
                    onChange={(e) => handleValidationChange('required', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {field.type === 'select' || field.type === 'radio' 
                      ? 'Selection required'
                      : 'Required field'
                    }
                  </span>
                </label>
              )}

              {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Length</label>
                    <input
                      type="number"
                      value={field.validation?.minLength || ''}
                      onChange={(e) => handleValidationChange('minLength', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Length</label>
                    <input
                      type="number"
                      value={field.validation?.maxLength || ''}
                      onChange={(e) => handleValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pattern (Regex)</label>
                    <input
                      type="text"
                      value={field.validation?.pattern || ''}
                      onChange={(e) => handleValidationChange('pattern', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="e.g., ^[A-Za-z]+$"
                    />
                  </div>
                </div>
              )}

              {field.type === 'number' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Value</label>
                    <input
                      type="number"
                      value={field.validation?.min || ''}
                      onChange={(e) => handleValidationChange('min', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Value</label>
                    <input
                      type="number"
                      value={field.validation?.max || ''}
                      onChange={(e) => handleValidationChange('max', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>
                </div>
              )}

              {field.type !== 'checkbox' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Error Message</label>
                  <input
                    type="text"
                    value={field.validation?.customMessage || ''}
                    onChange={(e) => handleValidationChange('customMessage', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black"
                    placeholder={
                      field.type === 'select' || field.type === 'radio'
                        ? 'Custom message when no option is selected'
                        : 'Custom error message when validation fails'
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 