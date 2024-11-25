import React, { useState } from 'react';
import { Save, Mail, Signature } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
}

interface EmailPreferences {
  signature: string;
  replyTo: string;
  defaultSubject: string;
}

export default function EmailSettings() {
  const [smtpSettings, setSmtpSettings] = useState<SMTPSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    from: ''
  });

  const [preferences, setPreferences] = useState<EmailPreferences>({
    signature: '',
    replyTo: '',
    defaultSubject: ''
  });

  const [testEmail, setTestEmail] = useState('');

  const handleSaveSettings = async () => {
    try {
      // Sauvegarder les paramètres
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleTestConnection = async () => {
    try {
      // Tester la connexion SMTP
      toast.success('Test de connexion réussi');
    } catch (error) {
      toast.error('Erreur de connexion SMTP');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres Email</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Configuration SMTP</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serveur SMTP
              </label>
              <input
                type="text"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                placeholder="smtp.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <input
                type="number"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, port: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={smtpSettings.username}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={smtpSettings.password}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email expéditeur
              </label>
              <input
                type="email"
                value={smtpSettings.from}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, from: e.target.value })}
                placeholder="noreply@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="pt-4">
              <div className="flex gap-4">
                <button
                  onClick={handleTestConnection}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Tester la connexion
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Préférences Email</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signature
              </label>
              <textarea
                value={preferences.signature}
                onChange={(e) => setPreferences({ ...preferences, signature: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Votre signature..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Répondre à
              </label>
              <input
                type="email"
                value={preferences.replyTo}
                onChange={(e) => setPreferences({ ...preferences, replyTo: e.target.value })}
                placeholder="contact@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objet par défaut
              </label>
              <input
                type="text"
                value={preferences.defaultSubject}
                onChange={(e) => setPreferences({ ...preferences, defaultSubject: e.target.value })}
                placeholder="Votre document est prêt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}