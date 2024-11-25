import React, { useState, useEffect } from 'react';
import { X, Send, Plus, Paperclip } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import { useTemplates } from '../context/TemplateContext';

interface EmailTemplateProps {
  onClose: () => void;
  attachmentName?: string;
}

export default function EmailTemplate({ onClose, attachmentName }: EmailTemplateProps) {
  const { emailTemplates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setSubject(template.subject);
        setBody(template.body);
      }
    }
  }, [selectedTemplate, emailTemplates]);

  const handleSend = async () => {
    try {
      if (!subject.trim()) {
        toast.error('Veuillez saisir un objet');
        return;
      }
      if (!body.trim()) {
        toast.error('Veuillez saisir un message');
        return;
      }
      // Logique d'envoi d'email
      toast.success('Email envoyé avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Envoyer par email</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template d'email
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un template</option>
              {emailTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
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
              Message
            </label>
            <Editor
              apiKey="your-tinymce-api-key"
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                  'emoticons', 'template'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help | emoticons | template',
                content_style: 'body { font-family:Poppins,Arial,sans-serif; font-size:14px }',
                branding: false,
                promotion: false,
                resize: true,
                statusbar: true
              }}
              value={body}
              onEditorChange={(content) => setBody(content)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièces jointes
            </label>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={() => handleRemoveAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {attachmentName && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{attachmentName}</span>
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                <span className="text-sm">Ajouter une pièce jointe</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleAddAttachment}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}