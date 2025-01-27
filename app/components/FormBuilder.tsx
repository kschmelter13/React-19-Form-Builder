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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { generateFormCode } from '../lib/form-generation/form-generator';

type StyleType = 'tailwind' | 'css';

export function FormBuilder() {
  const [formState, setFormState] = useState<FormState>({
    fields: [],
    title: 'React 19 Form Builder',
    description: 'Build type-safe forms with Server Actions and useActionState',
  });
  const [styleType, setStyleType] = useState<StyleType>('tailwind');
  const [languageType, setLanguageType] = useState<'typescript' | 'javascript'>('typescript');

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

  function handleUpdateField(updatedField: FormField) {
    setFormState((state) => ({
      ...state,
      fields: state.fields.map(f => f.id === updatedField.id ? updatedField : f),
    }));
  }

  function handleSetFields(fields: FormField[]) {
    setFormState((state) => ({
      ...state,
      fields,
    }));
  }

  function handleDownload(fileType: 'jsx' | 'tsx') {
    const generatedCode = generateFormCode(formState, {
      styleType,
      languageType: fileType === 'tsx' ? 'typescript' : 'javascript'
    });

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formState.title.toLowerCase().replace(/\s+/g, '-')}-form.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="editor" className="px-3 py-1.5">Editor</TabsTrigger>
              <TabsTrigger value="preview" className="px-3 py-1.5">Preview</TabsTrigger>
              <TabsTrigger value="code" className="px-3 py-1.5">Code</TabsTrigger>
            </TabsList>
        </div>

        <div className="grid grid-cols-[300px_1fr] gap-6">
          <FieldSelector onAddField={handleAddField} onSetFields={handleSetFields} />
          
          <div>
            <TabsContent value="editor">
              <div className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={formState.fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                      {formState.fields.map((field) => (
                        <DraggableField
                          key={field.id}
                          field={field}
                          onDelete={handleDeleteField}
                        onUpdate={handleUpdateField}
                        />
                      ))}
                  </SortableContext>
                </DndContext>
                
                      {formState.fields.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Drag and drop fields here to build your form
                        </div>
                      )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <FormPreview fields={formState.fields} />
            </TabsContent>
            
            <TabsContent value="code">
              <div className="relative w-full">
                <div className="mb-4">
                  <div className="flex items-center gap-4">
                    <Tabs value={styleType} onValueChange={(value) => setStyleType(value as StyleType)} className="w-auto">
                      <TabsList className="bg-gray-100 p-1">
                        <TabsTrigger value="tailwind" className="px-3 py-1.5">Tailwind</TabsTrigger>
                        <TabsTrigger value="css" className="px-3 py-1.5">Inline CSS</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Tabs value={languageType} onValueChange={(value) => setLanguageType(value as 'typescript' | 'javascript')} className="w-auto">
                      <TabsList className="bg-gray-100 p-1">
                        <TabsTrigger value="typescript" className="px-3 py-1.5">TypeScript</TabsTrigger>
                        <TabsTrigger value="javascript" className="px-3 py-1.5">JavaScript</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <div className="rounded-md border border-gray-200">
                  <div className="relative bg-gray-50 p-6 overflow-x-auto rounded-md">
                    <div className="flex gap-2 absolute top-2 right-2 z-10">
                      <button
                        onClick={() => handleDownload(languageType === 'typescript' ? 'tsx' : 'jsx')}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                      >
                        Download .{languageType === 'typescript' ? 'tsx' : 'jsx'}
                      </button>
                <button
                  onClick={() => {
                          navigator.clipboard.writeText(generateFormCode(formState, { styleType, languageType }));
                    alert('Code copied to clipboard!');
                  }}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                >
                  Copy
                </button>
                    </div>
                    <code className="block whitespace-pre-wrap rounded-md" style={{ fontFamily: 'monospace' }}>
                      {generateFormCode(formState, { styleType, languageType })}
                    </code>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
} 