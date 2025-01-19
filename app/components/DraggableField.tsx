import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../types/form-builder';
import { X } from 'lucide-react';

type DraggableFieldProps = {
  field: FormField;
  onDelete: (id: string) => void;
};

export function DraggableField({ field, onDelete }: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    data: field
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 pr-12 bg-white border rounded-lg shadow-sm mb-2 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">{field.label}</span>
          <span className="ml-2 text-sm text-gray-500">({field.type})</span>
        </div>
        <div className="flex items-center gap-2">
          {field.required && (
            <span className="text-sm text-red-500">Required</span>
          )}
        </div>
      </div>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(field.id);
        }}
        className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded-md transition-all"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
} 