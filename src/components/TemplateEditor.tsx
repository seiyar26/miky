import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Save, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';
import { toast } from 'react-hot-toast';
import PowerPointPreview from './PowerPointPreview';
import FieldEditor from './FieldEditor';
import { validatePowerPointFile } from '../lib/powerpoint';
import type { Field } from '../context/TemplateContext';

export default function TemplateEditor() {
  const { id } = useParams();
  const { templates, addTemplate, updateTemplate } = useTemplates();
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [powerPointFile, setPowerPointFile] = useState<File | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      const template = templates.find(t => t.id === id);
      if (template) {
        setName(template.name);
        setFields(template.fields);
        if (template.file) {
          setPowerPointFile(template.file);
        }
      }
    }
  }, [id, templates]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePowerPointFile(file)) {
      setPowerPointFile(file);
      setCurrentSlide(1);
      toast.success('PowerPoint importé avec succès');
    }
  };

  const handleAddField = (type: Field['type']) => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `Champ ${fields.length + 1}`,
      x: 50,
      y: 50,
      slide: currentSlide,
      fontFamily: 'Arial',
      fontSize: 12,
      color: '#000000',
      bold: false,
      italic: false
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const handleFieldPosition = (id: string, x: number, y: number) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : field
      )
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Veuillez donner un nom au template');
      return;
    }

    if (!id && !powerPointFile) {
      toast.error('Veuillez importer un fichier PowerPoint');
      return;
    }

    const templateData = {
      id: id || Date.now().toString(),
      name,
      fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      file: powerPointFile || undefined
    };

    if (id) {
      updateTemplate(templateData);
      toast.success('Template mis à jour avec succès');
    } else {
      addTemplate(templateData);
      toast.success('Template créé avec succès');
    }
    
    navigate('/');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Éditer le Template' : 'Nouveau Template'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du template
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du template"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {!id && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier PowerPoint
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Importer un fichier PowerPoint</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pptx,.ppt"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PPTX ou PPT uniquement</p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 relative rounded-md overflow-hidden">
                {powerPointFile && (
                  <PowerPointPreview
                    file={powerPointFile}
                    slide={currentSlide}
                    onTotalSlidesChange={setTotalSlides}
                  />
                )}
                {fields
                  .filter((field) => field.slide === currentSlide)
                  .map((field) => (
                    <div
                      key={field.id}
                      style={{
                        left: `${field.x}%`,
                        top: `${field.y}%`,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'move',
                        padding: '1px',
                        background: selectedField === field.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        border: selectedField === field.id ? '1px dashed rgb(99, 102, 241)' : '1px dashed transparent',
                        borderRadius: '2px',
                        fontSize: `${field.fontSize || 12}px`,
                        fontFamily: field.fontFamily || 'Arial',
                        color: field.color || '#000000',
                        fontWeight: field.bold ? 'bold' : 'normal',
                        fontStyle: field.italic ? 'italic' : 'normal',
                      }}
                      onClick={() => setSelectedField(field.id)}
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          const container = e.currentTarget.parentElement!;
                          const updatePosition = (moveEvent: MouseEvent) => {
                            const rect = container.getBoundingClientRect();
                            const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                            const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
                            handleFieldPosition(field.id, x, y);
                          };
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            moveEvent.preventDefault();
                            updatePosition(moveEvent);
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }
                      }}
                    >
                      {field.label}
                    </div>
                  ))}
              </div>

              {powerPointFile && totalSlides > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-md">
                  <button
                    onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                    disabled={currentSlide === 1}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-sm font-medium">
                    Slide {currentSlide} / {totalSlides}
                  </span>
                  <button
                    onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
                    disabled={currentSlide === totalSlides}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Ajouter des champs</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleAddField('text')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Champ texte
              </button>
              <button
                onClick={() => handleAddField('date')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Champ date
              </button>
              <button
                onClick={() => handleAddField('image')}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Champ image
              </button>
            </div>

            {selectedField && (
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-3">Propriétés du champ</h3>
                <FieldEditor
                  field={fields.find((f) => f.id === selectedField)!}
                  onUpdate={(updatedField) => {
                    setFields(
                      fields.map((field) =>
                        field.id === selectedField ? updatedField : field
                      )
                    );
                  }}
                  onDelete={() => {
                    setFields(fields.filter((field) => field.id !== selectedField));
                    setSelectedField(null);
                  }}
                  totalSlides={totalSlides}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}