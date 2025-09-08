import React, { createContext, useContext, useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';

export interface LibraryBook {
  _id: string;
  userId: string;
  bookId: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  readingStatus: 'not-started' | 'reading' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface LibraryContextType {
  library: LibraryBook[];
  addToLibrary: (book: any) => Promise<void>;
  removeFromLibrary: (bookId: string) => Promise<void>;
  updateReadingStatus: (bookId: string, status: 'not-started' | 'reading' | 'completed') => Promise<void>;
  isInLibrary: (bookId: string) => boolean;
  isLoading: boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshLibrary = async () => {
    if (!user) {
      setLibrary([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await libraryAPI.getLibrary();
      setLibrary(response.data.library);
    } catch (error) {
      console.error('Failed to fetch library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, [user]);

  const addToLibrary = async (book: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save books to your library.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookData = {
        bookId: book.id,
        title: book.title,
        authors: book.authors || [],
        thumbnail: book.imageLinks?.thumbnail || '',
        description: book.description || ''
      };

      await libraryAPI.addBook(bookData);
      await refreshLibrary();
      
      toast({
        title: "Book Added",
        description: `"${book.title}" has been added to your library.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add book to library';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const removeFromLibrary = async (bookId: string) => {
    try {
      await libraryAPI.removeBook(bookId);
      await refreshLibrary();
      
      toast({
        title: "Book Removed",
        description: "Book has been removed from your library.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove book from library';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateReadingStatus = async (bookId: string, status: 'not-started' | 'reading' | 'completed') => {
    try {
      await libraryAPI.updateBookStatus(bookId, status);
      await refreshLibrary();
      
      const statusText = status === 'not-started' ? 'Not Started' : 
                        status === 'reading' ? 'Currently Reading' : 'Completed';
      
      toast({
        title: "Status Updated",
        description: `Reading status updated to ${statusText}.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update reading status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const isInLibrary = (bookId: string) => {
    return library.some(book => book.bookId === bookId);
  };

  return (
    <LibraryContext.Provider value={{
      library,
      addToLibrary,
      removeFromLibrary,
      updateReadingStatus,
      isInLibrary,
      isLoading,
      refreshLibrary
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};