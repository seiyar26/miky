import React, { useEffect, useState, useCallback } from 'react';
import { convertPPTXtoImages } from '../lib/powerpoint';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface PowerPointPreviewProps {
  file: File;
  slide: number;
  onTotalSlidesChange: (total: number) => void;
}

export default function PowerPointPreview({ file, slide, onTotalSlidesChange }: PowerPointPreviewProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlides = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const { slides, totalSlides } = await convertPPTXtoImages(file);
      setSlides(slides);
      onTotalSlidesChange(totalSlides);
    } catch (error) {
      console.error('PowerPoint preview error:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement du PowerPoint');
    } finally {
      setIsLoading(false);
    }
  }, [file, onTotalSlidesChange]);

  useEffect(() => {
    loadSlides();

    // Cleanup function to revoke object URLs
    return () => {
      slides.forEach(slide => URL.revokeObjectURL(slide));
    };
  }, [loadSlides]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Conversion du PowerPoint...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSlides}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Aucune slide disponible</p>
      </div>
    );
  }

  const currentSlide = slides[slide - 1];
  
  if (!currentSlide) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Slide non trouvée</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <img 
        src={currentSlide} 
        alt={`Slide ${slide}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}