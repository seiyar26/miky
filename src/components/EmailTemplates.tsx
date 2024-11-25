import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, X, Save } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import { useTemplates } from '../context/TemplateContext';

const DEFAULT_TEMPLATES = [
  {
    id: '1',
    name: 'Proposition Commerciale',
    subject: 'Votre proposition commerciale personnalisée',
    body: `Cher(e) {client},

Je vous prie de trouver ci-joint notre proposition commerciale détaillée, adaptée à vos besoins spécifiques.

Cette offre comprend l'ensemble des éléments que nous avons discutés lors de notre dernier échange.

N'hésitez pas à me contacter pour toute question ou précision.

Cordialement,
{signature}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Suivi de Projet',
    subject: 'Point d\'avancement de votre projet',
    body: `Bonjour {client},

Veuillez trouver ci-joint le rapport d'avancement détaillé de votre projet.

Points clés :
- État d'avancement global
- Prochaines étapes
- Points d'attention

Je reste à votre disposition pour en discuter plus en détail.

Cordialement,
{signature}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Facture Mensuelle',
    subject: 'Facture du mois - {mois}',
    body: `Cher(e) client(e),

Veuillez trouver ci-joint la facture correspondant à nos prestations du mois.

Un récapitulatif détaillé des services est inclus dans le document.

Pour tout renseignement complémentaire, n'hésitez pas à nous contacter.

Cordialement,
{signature}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Rapport d\'Activité',
    subject: 'Rapport d\'activité mensuel - {mois}',
    body: `Cher(e) {client},

Veuillez trouver ci-joint notre rapport d'activité mensuel détaillant :

1. Les objectifs atteints
2. Les actions réalisées
3. Les perspectives pour le mois prochain
4. Les points nécessitant votre attention

Je reste à votre disposition pour échanger sur ces éléments.

Cordialement,
{signature}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Documents Contractuels',
    subject: 'Documents contractuels pour signature',
    body: `Cher(e) {client},

Suite à nos récents échanges, vous trouverez ci-joint les documents contractuels pour signature :

- Contrat de prestation
- Conditions générales
- Annexes techniques

Merci de bien vouloir :
1. Vérifier l'ensemble des documents
2. Les signer électroniquement
3. Nous les retourner dans les meilleurs délais

Je reste à votre entière disposition pour toute question.

Cordialement,
{signature}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function EmailTemplates() {
  const { emailTemplates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useTemplates();
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  React.useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setSubject(editingTemplate.subject);
      setBody(editingTemplate.body);
    } else {
      setName('');
      setSubject('');
      setBody('');
    }
  }, [editingTemplate]);

  const handleSave = () => {
    if (!name.trim() || !subject.trim() || !body.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const template = {
      id: editingTemplate?.id || Date.now().toString(),
      name: name.trim(),
      subject: subject.trim(),
      body: body.trim(),
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTemplate) {
      updateEmailTemplate(template);
      toast.success('Template mis à jour avec succès');
    } else {
      addEmailTemplate(template);
      toast.success('Template créé avec succès');
    }

    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      deleteEmailTemplate(id);
      toast.success('Template supprimé avec succès');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Templates Email</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowEditor(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emailTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowEditor(true);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
              <p className="text-sm text-gray-500 line-clamp-3">{template.body}</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Modifié le {new Date(template.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {emailTemplates.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template</h3>
          <p className="text-gray-500">Commencez par créer votre premier template d'email</p>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h2>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingTemplate(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du template
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <Editor
                  apiKey="your-tinymce-api-key"
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat',
                    content_style: 'body { font-family:Poppins,Arial,sans-serif; font-size:14px }'
                  }}
                  value={body}
                  onEditorChange={(content) => setBody(content)}
                />
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingTemplate(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}