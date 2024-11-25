import React from 'react';
import { X } from 'lucide-react';
import type { Field } from '../context/TemplateContext';

const FONT_FAMILIES = [
  'Poppins',
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Courier New'
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

interface FieldEditorProps {
  field: Field;
  onUpdate: (field: Field) => void;
  onDelete: () => void;
  totalSlides: number;
}

export default function FieldEditor({ field, onUpdate, onDelete, totalSlides }: FieldEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ ...field, label: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Police</label>
        <select
          value={field.fontFamily || 'Poppins'}
          onChange={(e) => onUpdate({ ...field, fontFamily: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
        >
          {FONT_FAMILIES.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Taille</label>
        <select
          value={field.fontSize || 12}
          onChange={(e) => onUpdate({ ...field, fontSize: Number(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Couleur</label>
        <input
          type="color"
          value={field.color || '#000000'}
          onChange={(e) => onUpdate({ ...field, color: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.bold}
            onChange={(e) => onUpdate({ ...field, bold: e.target.checked })}
            className="mr-2"
          />
          Gras
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.italic}
            onChange={(e) => onUpdate({ ...field, italic: e.target.checked })}
            className="mr-2"
          />
          Italique
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slide</label>
        <input
          type="number"
          min={1}
          max={totalSlides}
          value={field.slide}
          onChange={(e) => {
            const slideNumber = parseInt(e.target.value);
            if (slideNumber >= 1 && slideNumber <= totalSlides) {
              onUpdate({ ...field, slide: slideNumber });
            }
          }}
          className="mt-1 block w-full px-3 py-2 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
        />
      </div>

      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
      >
        <X className="w-5 h-5 mr-2" />
        Supprimer
      </button>
    </div>
  );
}