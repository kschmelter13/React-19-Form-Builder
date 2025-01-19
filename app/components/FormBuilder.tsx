'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableField } from './DraggableField';
import { FieldSelector } from './FieldSelector';
import { FormPreview } from './FormPreview';
import { FormField, FormState } from '../types/form-builder';
import { useActionState } from 'react';
import { saveForm } from '../actions/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type StyleType = 'tailwind' | 'css';

export function FormBuilder() {
  const [formState, setFormState] = useState<FormState>({
    fields: [],
    title: 'React 19 Form Builder',
    description: 'Build type-safe forms with Server Actions and useActionState',
  });
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [styleType, setStyleType] = useState<StyleType>('tailwind');

  const [state, formAction, isPending] = useActionState(saveForm, null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormState((state) => {
        const oldIndex = state.fields.findIndex((f) => f.id === active.id);
        const newIndex = state.fields.findIndex((f) => f.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newFields = [...state.fields];
          const [movedField] = newFields.splice(oldIndex, 1);
          newFields.splice(newIndex, 0, movedField);
          return {
            ...state,
            fields: newFields,
          };
        }
        return state;
      });
    }
  }

  function handleAddField(field: FormField) {
    setFormState((state) => ({
      ...state,
      fields: [...state.fields, field],
    }));
  }

  function handleDeleteField(fieldId: string) {
    setFormState((state) => ({
      ...state,
      fields: state.fields.filter(f => f.id !== fieldId),
    }));
  }

  function generateInputCode(field: FormField) {
    const baseInputStyle = styleType === 'css' 
      ? `{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '1rem', transition: 'border-color 0.2s' }`
      : undefined;

    const baseInputClass = "w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors";
    
    const labelProps = styleType === 'tailwind'
      ? `className="block text-sm font-medium mb-1.5"`
      : `style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}`;

    let fieldCode = '';
    
    if (field.type === 'textarea') {
      fieldCode = `
        <textarea
          name="${field.name}"
          id="${field.name}"
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
          ${field.required ? 'required' : ''}
          ${styleType === 'tailwind' ? `className="${baseInputClass}"` : `style={${baseInputStyle}}`}
          rows={4}
        />`;
    } else if (field.type === 'select') {
      fieldCode = `
        <select
          name="${field.name}"
          id="${field.name}"
          ${field.required ? 'required' : ''}
          ${styleType === 'tailwind' ? `className="${baseInputClass}"` : `style={${baseInputStyle}}`}
        >
          <option value="">Select an option</option>
          ${field.options?.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n          ') || ''}
        </select>`;
    } else if (field.type === 'checkbox') {
      const checkboxClass = "h-4 w-4 text-black rounded border-gray-300 focus:ring-black";
      fieldCode = `
        <div ${styleType === 'tailwind' ? 'className="flex items-center"' : 'style={{ display: \'flex\', alignItems: \'center\' }}'}>
          <input
            type="checkbox"
            name="${field.name}"
            id="${field.name}"
            ${field.required ? 'required' : ''}
            ${styleType === 'tailwind' ? `className="${checkboxClass}"` : 'style={{ height: \'1rem\', width: \'1rem\' }}'}
          />
          <label 
            htmlFor="${field.name}"
            ${styleType === 'tailwind' ? 'className="ml-2 text-sm"' : 'style={{ marginLeft: \'0.5rem\', fontSize: \'0.875rem\' }}'}
          >
            ${field.label}
          </label>
        </div>`;
    } else if (field.type === 'radio') {
      const radioClass = "h-4 w-4 text-black border-gray-300 focus:ring-black";
      fieldCode = `
        <div ${styleType === 'tailwind' ? 'className="space-y-2"' : 'style={{ display: \'flex\', flexDirection: \'column\', gap: \'0.5rem\' }}'}>
          ${field.options?.map(option => `
          <div ${styleType === 'tailwind' ? 'className="flex items-center"' : 'style={{ display: \'flex\', alignItems: \'center\' }}'}>
            <input
              type="radio"
              name="${field.name}"
              id="${field.name}-${option.value}"
              value="${option.value}"
              ${field.required ? 'required' : ''}
              ${styleType === 'tailwind' ? `className="${radioClass}"` : 'style={{ height: \'1rem\', width: \'1rem\' }}'}
            />
            <label
              htmlFor="${field.name}-${option.value}"
              ${styleType === 'tailwind' ? 'className="ml-2 text-sm"' : 'style={{ marginLeft: \'0.5rem\', fontSize: \'0.875rem\' }}'}
            >
              ${option.label}
            </label>
          </div>`).join('\n          ') || ''}
        </div>`;
    } else {
      fieldCode = `
        <input
          type="${field.type}"
          name="${field.name}"
          id="${field.name}"
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
          ${field.required ? 'required' : ''}
          ${styleType === 'tailwind' ? `className="${baseInputClass}"` : `style={${baseInputStyle}}`}
        />`;
    }

    return `      <div ${styleType === 'tailwind' 
      ? 'className="space-y-2"' 
      : 'style={{ display: \'flex\', flexDirection: \'column\', gap: \'0.5rem\' }}'
    }>
        <label htmlFor="${field.name}" ${labelProps}>${field.label}</label>
        ${fieldCode}
      </div>`;
  }

  function generateFormCode() {
    const imports = `'use client';\n\nimport { useActionState } from 'react';\n\n`;
    
    const serverAction = `async function handleSubmit(prevState: any, formData: FormData) {
  // Move this to a separate file to use 'use server'
  //'use server';
  // Handle form submission here
  return { success: true, message: 'Form submitted successfully!' };
}\n\n`;

    const formContainerProps = styleType === 'tailwind'
      ? 'className="w-full max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6"'
      : 'style={{ width: \'100%\', maxWidth: \'42rem\', margin: \'0 auto\', padding: \'2rem 1rem\', display: \'flex\', flexDirection: \'column\', gap: \'1.5rem\' }}';

    const submitButtonProps = styleType === 'tailwind'
      ? 'className="w-auto min-w-[120px] px-5 py-2.5 text-white bg-black rounded-md hover:bg-gray-900 disabled:opacity-50 transition-colors"'
      : 'style={{ minWidth: \'120px\', padding: \'0.625rem 1.25rem\', color: \'white\', backgroundColor: isPending ? \'#666\' : \'#000\', borderRadius: \'0.375rem\', cursor: isPending ? \'not-allowed\' : \'pointer\', transition: \'background-color 0.2s\' }}';

    const messageProps = styleType === 'tailwind'
      ? 'className={`text-center mt-4 ${state.success ? \'text-green-600\' : \'text-red-600\'}`}'
      : 'style={{ textAlign: \'center\', marginTop: \'1rem\', color: state.success ? \'#059669\' : \'#dc2626\' }}';

    const formFields = formState.fields.map(field => generateInputCode(field)).join('\n\n');

    return `${imports}${serverAction}export default function GeneratedForm() {
  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction} ${formContainerProps}>
${formFields}

      <div ${styleType === 'tailwind' ? 'className="mt-8"' : 'style={{ marginTop: \'2rem\' }}'}>
        <button
          type="submit"
          disabled={isPending}
          ${submitButtonProps}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {state?.message && (
        <p ${messageProps}>
          {state.message}
        </p>
      )}
    </form>
  );
}`;
  }

  function handleDownload(fileType: 'jsx' | 'tsx') {
    const code = generateFormCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formState.title.toLowerCase().replace(/\s+/g, '-')}-form.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setShowFileTypeModal(false);
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <Tabs defaultValue="editor" className="w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => setFormState(s => ({ ...s, title: e.target.value }))}
              className="text-3xl font-bold bg-transparent border-none focus:outline-none"
              placeholder="Form Title"
            />
            <input
              type="text"
              value={formState.description || ''}
              onChange={(e) => setFormState(s => ({ ...s, description: e.target.value }))}
              className="text-gray-500 bg-transparent border-none focus:outline-none w-full"
              placeholder="Form Description"
            />
          </div>
          <div className="flex items-center gap-4">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="editor" className="px-3 py-1.5">Editor</TabsTrigger>
              <TabsTrigger value="preview" className="px-3 py-1.5">Preview</TabsTrigger>
              <TabsTrigger value="code" className="px-3 py-1.5">Code</TabsTrigger>
            </TabsList>
            <Tabs value={styleType} onValueChange={(value) => setStyleType(value as StyleType)} className="w-auto">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="tailwind" className="px-3 py-1.5">Tailwind</TabsTrigger>
                <TabsTrigger value="css" className="px-3 py-1.5">Inline CSS</TabsTrigger>
              </TabsList>
            </Tabs>
            <button
              onClick={() => setShowFileTypeModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
            >
              Download Code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[300px_1fr] gap-6">
          <FieldSelector onAddField={handleAddField} />
          
          <div>
            <TabsContent value="editor">
              <div className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={formState.fields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {formState.fields.map((field) => (
                        <DraggableField
                          key={field.id}
                          field={field}
                          onDelete={handleDeleteField}
                        />
                      ))}
                      {formState.fields.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Drag and drop fields here to build your form
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <FormPreview fields={formState.fields} />
            </TabsContent>
            <TabsContent value="code">
              <div className="relative w-full">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateFormCode());
                    alert('Code copied to clipboard!');
                  }}
                  className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors z-10"
                >
                  Copy
                </button>
                <div className="rounded-md border border-gray-200">
                  <div className="bg-gray-50 p-6 overflow-x-auto rounded-md">
                    <code className="block whitespace-pre-wrap rounded-md" style={{ fontFamily: 'monospace' }}>{generateFormCode()}</code>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {showFileTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Choose File Type</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleDownload('jsx')}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
              >
                JavaScript (.jsx)
              </button>
              <button
                onClick={() => handleDownload('tsx')}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
              >
                TypeScript (.tsx)
              </button>
            </div>
            <button
              onClick={() => setShowFileTypeModal(false)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 