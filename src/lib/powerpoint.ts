import { toast } from 'react-hot-toast';

const CONVERT_API_KEY = 'secret_aorNSuR1jkrk69jD';
const CONVERT_API_URL = 'https://v2.convertapi.com/convert/pptx/to/jpg';

// Constantes pour l'alignement
const SNAP_THRESHOLD = 10; // pixels
const LINE_HEIGHT = 1.2; // multiplicateur de hauteur de ligne

export function validatePowerPointFile(file: File): boolean {
  const validExtensions = ['.pptx', '.ppt'];
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(extension)) {
    toast.error('Format de fichier non supporté. Utilisez .pptx ou .ppt');
    return false;
  }
  
  if (file.size > 50 * 1024 * 1024) {
    toast.error('Le fichier est trop volumineux (max 50MB)');
    return false;
  }
  
  return true;
}

export function detectTextAlignment(x: number, y: number, fields: any[], imageData: ImageData): { x: number; y: number } {
  const alignedPosition = { x, y };

  // Recherche de lignes de texte dans l'image
  const textLines = detectTextLines(imageData);
  
  // Trouver la ligne la plus proche
  let closestLine = null;
  let minDistance = SNAP_THRESHOLD;

  for (const line of textLines) {
    const distance = Math.abs(line.y - y);
    if (distance < minDistance) {
      minDistance = distance;
      closestLine = line;
    }
  }

  // Si une ligne est trouvée, aligner verticalement
  if (closestLine) {
    alignedPosition.y = closestLine.y;
    
    // Aligner horizontalement à la fin du texte si proche
    if (Math.abs(x - (closestLine.x + closestLine.width)) < SNAP_THRESHOLD) {
      alignedPosition.x = closestLine.x + closestLine.width + 5; // 5px de marge
    }
  }

  // Vérifier l'alignement avec les champs existants
  for (const field of fields) {
    if (Math.abs(field.y - y) < SNAP_THRESHOLD) {
      alignedPosition.y = field.y;
    }
    if (Math.abs(field.x - x) < SNAP_THRESHOLD) {
      alignedPosition.x = field.x;
    }
  }

  return alignedPosition;
}

function detectTextLines(imageData: ImageData): Array<{x: number; y: number; width: number}> {
  // Cette fonction utiliserait une bibliothèque de reconnaissance de texte
  // pour détecter les lignes de texte dans l'image
  // Pour l'instant, on retourne un tableau vide
  return [];
}

export async function convertPPTXtoImages(file: File): Promise<{ slides: string[]; totalSlides: number }> {
  try {
    const formData = new FormData();
    formData.append('File', file);

    const response = await fetch(CONVERT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONVERT_API_KEY}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Erreur API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    if (!data.Files || !Array.isArray(data.Files) || data.Files.length === 0) {
      throw new Error('Aucune slide trouvée dans le PowerPoint');
    }

    const slides: string[] = [];

    // Trier les fichiers par nom pour assurer l'ordre correct des slides
    const sortedFiles = data.Files.sort((a: any, b: any) => {
      const getSlideNumber = (filename: string) => {
        const match = filename.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return getSlideNumber(a.FileName) - getSlideNumber(b.FileName);
    });

    for (const file of sortedFiles) {
      if (!file.FileData) continue;
      try {
        const imageBlob = await fetch(`data:image/jpeg;base64,${file.FileData}`).then(r => r.blob());
        const imageUrl = URL.createObjectURL(imageBlob);
        slides.push(imageUrl);
      } catch (error) {
        console.error(`Erreur lors de la conversion de la slide:`, error);
      }
    }

    if (slides.length === 0) {
      throw new Error('Impossible de convertir les slides du PowerPoint');
    }

    return {
      slides,
      totalSlides: slides.length
    };
  } catch (error) {
    console.error('PowerPoint conversion error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Erreur lors de la conversion du PowerPoint'
    );
  }
}