import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Edit2, PenTool, Copy, Trash2, Edit3 } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const { templates, deleteTemplate, duplicateTemplate, updateTemplate } = useTemplates();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const handleDuplicate = (templateId: string) => {
    duplicateTemplate(templateId);
    toast.success('Template dupliqué avec succès');
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      deleteTemplate(templateId);
      toast.success('Template supprimé avec succès');
    }
  };

  const startEditing = (template: any) => {
    setEditingId(template.id);
    setEditingName(template.name);
  };

  const handleRename = (templateId: string) => {
    if (editingName.trim()) {
      updateTemplate({
        ...templates.find(t => t.id === templateId)!,
        name: editingName.trim(),
        updatedAt: new Date().toISOString()
      });
      setEditingId(null);
      toast.success('Template renommé avec succès');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Templates</h1>
        <Link
          to="/template/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template</h3>
          <p className="text-gray-500">Commencez par créer votre premier template</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {template.preview ? (
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                {editingId === template.id ? (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(template.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => handleRename(template.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <button
                      onClick={() => startEditing(template)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Renommer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Modifié le {new Date(template.updatedAt).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => handleDuplicate(template.id)}
                    className="flex items-center justify-center px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Dupliquer
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="flex items-center justify-center px-2 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/template/fill/${template.id}`}
                    className="flex items-center justify-center px-3 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Remplir
                  </Link>
                  <Link
                    to={`/template/edit/${template.id}`}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Éditer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}