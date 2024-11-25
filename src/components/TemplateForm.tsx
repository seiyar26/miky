import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Download, Mail } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';
import { toast } from 'react-hot-toast';
import PowerPointPreview from './PowerPointPreview';
import EmailTemplate from './EmailTemplate';

export default function TemplateForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, addToHistory } = useTemplates();
  const template = templates.find((t) => t.id === id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);

  if (!template) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Template non trouvé</h3>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ajouter à l'historique
      const clientName = values['Nom'] || values['Client'] || 'Client';
      addToHistory({
        id: Date.now().toString(),
        templateId: template.id,
        templateName: template.name,
        clientName,
        createdAt: new Date().toISOString(),
        values
      });
      toast.success('Document sauvegardé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleExport = () => {
    try {
      // Logique d'export
      const clientName = values['Nom'] || values['Client'] || 'Client';
      addToHistory({
        id: Date.now().toString(),
        templateId: template.id,
        templateName: template.name,
        clientName,
        createdAt: new Date().toISOString(),
        values
      });
      toast.success('Document exporté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const currentFields = template.fields.filter(field => field.slide === currentSlide);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Remplir le template: {template.name}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Mail className="w-5 h-5 mr-2" />
            Envoyer par email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-[4/3] bg-gray-100 relative rounded-md">
              {template.file ? (
                <PowerPointPreview
                  file={template.file}
                  slide={currentSlide}
                  onTotalSlidesChange={setTotalSlides}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Aperçu non disponible</p>
                </div>
              )}
              {currentFields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    fontSize: `${field.fontSize || 12}px`,
                    fontFamily: field.fontFamily || 'Arial',
                    color: field.color || '#000000',
                    fontWeight: field.bold ? 'bold' : 'normal',
                    fontStyle: field.italic ? 'italic' : 'normal',
                  }}
                >
                  {values[field.id] || field.label}
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                  disabled={currentSlide === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  ←
                </button>
                <span className="text-sm font-medium">
                  Slide {currentSlide} sur {totalSlides}
                </span>
                <button
                  onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
                  disabled={currentSlide === totalSlides}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Remplir les champs</h2>
            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} (Slide {field.slide})
                  </label>
                  {field.type === 'date' ? (
                    <input
                      type="date"
                      value={values[field.id] || ''}
                      onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : field.type === 'image' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setValues({ ...values, [field.id]: reader.result as string });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.id] || ''}
                      onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Sauvegarder
            </button>
          </form>
        </div>
      </div>

      {showEmailModal && (
        <EmailTemplate
          onClose={() => setShowEmailModal(false)}
          attachmentName={`${template.name}.pdf`}
        />
      )}
    </div>
  );
}