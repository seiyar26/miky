import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Category = {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type Field = {
  id: string;
  type: 'text' | 'date' | 'image';
  label: string;
  x: number;
  y: number;
  slide: number;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  alignment?: 'left' | 'center' | 'right';
};

export type Template = {
  id: string;
  name: string;
  categoryId?: string;
  image?: string;
  fields: Field[];
  file?: File;
  createdAt: string;
  updatedAt: string;
  preview?: string;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type HistoryEntry = {
  id: string;
  templateId: string;
  templateName: string;
  clientName: string;
  createdAt: string;
  values: Record<string, string>;
  exportedFile?: string;
};

type TemplateContextType = {
  templates: Template[];
  categories: Category[];
  emailTemplates: EmailTemplate[];
  history: HistoryEntry[];
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addEmailTemplate: (template: EmailTemplate) => void;
  updateEmailTemplate: (template: EmailTemplate) => void;
  deleteEmailTemplate: (id: string) => void;
  addToHistory: (entry: HistoryEntry) => void;
};

const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Envoi de document commercial',
    subject: 'Proposition commerciale',
    body: `Cher(e) client(e),

Je vous prie de trouver ci-joint notre proposition commerciale détaillée.

N'hésitez pas à me contacter pour toute question.

Cordialement,
[Votre signature]`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Suivi de projet',
    subject: 'Point d\'avancement projet',
    body: `Bonjour,

Veuillez trouver ci-joint le document de suivi de notre projet.

Je reste à votre disposition pour en discuter.

Cordialement,
[Votre signature]`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Facture mensuelle',
    subject: 'Facture du mois',
    body: `Bonjour,

Veuillez trouver ci-joint la facture du mois.

Merci de votre confiance.

Cordialement,
[Votre signature]`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Rapport d\'activité',
    subject: 'Rapport d\'activité mensuel',
    body: `Cher(e) client(e),

Veuillez trouver ci-joint notre rapport d'activité mensuel.

Je reste à votre disposition pour tout complément d'information.

Cordialement,
[Votre signature]`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Document contractuel',
    subject: 'Documents contractuels pour signature',
    body: `Bonjour,

Suite à nos échanges, vous trouverez ci-joint les documents contractuels pour signature.

Je vous remercie de me les retourner signés dans les meilleurs délais.

Cordialement,
[Votre signature]`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const TemplateContext = createContext<TemplateContextType | null>(null);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(DEFAULT_EMAIL_TEMPLATES);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addTemplate = (template: Template) => {
    setTemplates([...templates, template]);
  };

  const updateTemplate = (template: Template) => {
    setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const duplicateTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      const newTemplate = {
        ...template,
        id: uuidv4(),
        name: `${template.name} (copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: template.fields.map(field => ({
          ...field,
          id: uuidv4()
        }))
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (category: Category) => {
    setCategories(categories.map((c) => (c.id === category.id ? category : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const addEmailTemplate = (template: EmailTemplate) => {
    setEmailTemplates([...emailTemplates, template]);
  };

  const updateEmailTemplate = (template: EmailTemplate) => {
    setEmailTemplates(emailTemplates.map((t) => (t.id === template.id ? template : t)));
  };

  const deleteEmailTemplate = (id: string) => {
    setEmailTemplates(emailTemplates.filter((t) => t.id !== id));
  };

  const addToHistory = (entry: HistoryEntry) => {
    setHistory([entry, ...history]);
  };

  return (
    <TemplateContext.Provider 
      value={{ 
        templates,
        categories,
        emailTemplates,
        history,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        addCategory,
        updateCategory,
        deleteCategory,
        addEmailTemplate,
        updateEmailTemplate,
        deleteEmailTemplate,
        addToHistory
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}