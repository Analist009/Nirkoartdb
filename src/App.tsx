import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { TopNavigation } from './components/Navigation';
import { StyleSelector } from './components/StyleSelector';
import { ImagePreview } from './components/ImagePreview';
import { PromptInput } from './components/PromptInput';
import { FreeformPrompt } from './components/FreeformPrompt';
import { AboutArtist } from './components/AboutArtist';
import { ImageSearch } from './components/ImageSearch';
import { AILoadingSpinner } from './components/AILoadingSpinner';
import { ApiUsageStats } from './components/ApiUsageStats';
import { GalleryCategories } from './components/GalleryCategories';
import { SystemStatus } from './components/SystemStatus';
import { AuthWrapper } from './components/AuthWrapper';
import { UserProfile } from './components/UserProfile';
import { useImageStore } from './store/useImageStore';
import { useSystemStatus } from './store/useSystemStatus';
import { generateImage } from './lib/imageGeneration';
import { getErrorMessage } from './lib/errors';
import { useSession } from './lib/session';

function App() {
  const [selectedArtistStyle, setSelectedArtistStyle] = useState<string | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { images, addImage, getImagesByCategory } = useImageStore();
  const { isValid } = useSession();
  const { startMonitoring, stopMonitoring } = useSystemStatus();

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    if (!isValid()) {
      toast.error('נדרש מפתח API תקף');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateImage({
        prompt,
        artistStyle: selectedArtistStyle,
        artStyle: selectedArtStyle
      });

      await addImage(result);
      toast.success('התמונה נוצרה בהצלחה!');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component remains the same ...

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 text-right" dir="rtl">
        <Toaster 
          position="top-center" 
          expand={true} 
          richColors 
          closeButton 
          theme="light" 
          dir="rtl"
        />
        
        <TopNavigation />
        
        <main className="container mx-auto px-4 pt-20 pb-16">
          {/* ... existing components ... */}
        </main>

        <AILoadingSpinner isVisible={isLoading} />
        <SystemStatus />
      </div>
    </AuthWrapper>
  );
}

export default App;