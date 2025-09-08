import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BookOpen, Bookmark, BookmarkCheck, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  averageRating?: number;
  publishedDate?: string;
  categories?: string[];
  previewLink?: string;
}

export type ReadingStatus = "not-started" | "reading" | "completed";

interface BookCardProps {
  book: Book;
  readingStatus?: ReadingStatus;
  onStatusChange?: (bookId: string, status: ReadingStatus) => void;
  onSaveToLibrary?: (book: Book) => void;
  isInLibrary?: boolean;
}

const getStatusColor = (status: ReadingStatus) => {
  switch (status) {
    case "not-started":
      return "bg-muted text-muted-foreground";
    case "reading":
      return "bg-warning text-warning-foreground";
    case "completed":
      return "bg-success text-success-foreground";
  }
};

const getStatusText = (status: ReadingStatus) => {
  switch (status) {
    case "not-started":
      return "Not Started";
    case "reading":
      return "Reading";
    case "completed":
      return "Completed";
  }
};

export const BookCard = ({ 
  book, 
  readingStatus = "not-started", 
  onStatusChange, 
  onSaveToLibrary,
  isInLibrary = false 
}: BookCardProps) => {
  const [currentStatus, setCurrentStatus] = useState<ReadingStatus>(readingStatus);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStatusClick = () => {
    const statusOrder: ReadingStatus[] = ["not-started", "reading", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setCurrentStatus(nextStatus);
    onStatusChange?.(book.id, nextStatus);
  };

  const handleSaveToLibrary = () => {
    if (!user) {
      alert('Please login to save books to your library.');
      return;
    }
    console.log('Saving book:', book.title, 'isInLibrary:', isInLibrary);
    onSaveToLibrary?.(book);
  };

  return (
    <>
    <Card 
      className="h-full overflow-hidden bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
      onClick={() => setShowModal(true)}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/5 to-accent/5">
          {book.imageLinks?.thumbnail ? (
            <img
              src={book.imageLinks.thumbnail}
              alt={book.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <BookOpen className="w-16 h-16 text-primary/30" />
            </div>
          )}
          {book.averageRating && (
            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs font-medium">{book.averageRating.toFixed(1)}</span>
            </div>
          )}
          <button
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              padding: '8px',
              backgroundColor: isInLibrary ? '#10B981' : '#F3F4F6',
              color: isInLibrary ? 'white' : '#4B5563',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSaveToLibrary();
            }}
          >
            {isInLibrary ? '🔖' : '📑'}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col" style={{minHeight: '200px'}}>
        <div className="flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          {book.authors && (
            <p className="text-xs text-muted-foreground mb-2">
              by {book.authors.join(", ")}
            </p>
          )}
          {book.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
              {book.description}
            </p>
          )}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {book.categories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>
        

      </CardContent>
    </Card>
    
    {/* Modal Detail Buku */}
    {showModal && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          border: '1px solid #F3F4F6'
        }}>
          <button
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 1002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              color: '#4B5563'
            }}
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          
          <div style={{padding: '24px'}}>
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
              {book.imageLinks?.thumbnail ? (
                <img
                  src={book.imageLinks.thumbnail}
                  alt={book.title}
                  style={{width: '150px', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                />
              ) : (
                <div style={{width: '150px', height: '200px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <BookOpen style={{width: '48px', height: '48px', color: '#9ca3af'}} />
                </div>
              )}
              
              <div style={{flex: 1}}>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827'}}>
                  {book.title}
                </h2>
                {book.authors && (
                  <p style={{fontSize: '16px', color: '#4B5563', marginBottom: '12px'}}>
                    by {book.authors.join(', ')}
                  </p>
                )}
                {book.averageRating && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px'}}>
                    <Star style={{width: '16px', height: '16px', color: '#fbbf24', fill: '#fbbf24'}} />
                    <span style={{fontSize: '14px', fontWeight: '500'}}>{book.averageRating.toFixed(1)}</span>
                  </div>
                )}
                {book.categories && book.categories.length > 0 && (
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px'}}>
                    {book.categories.slice(0, 3).map((category, index) => (
                      <span key={index} style={{
                        padding: '4px 8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {book.description && (
              <div style={{marginBottom: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827'}}>Description</h3>
                <p style={{fontSize: '14px', lineHeight: '1.6', color: '#4b5563'}}>
                  {book.description}
                </p>
              </div>
            )}
            
            {/* Reading Status Tracker */}
            {isInLibrary && (
              <div style={{marginBottom: '20px', padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '8px'}}>
                <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827'}}>Reading Progress</h4>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: currentStatus === 'not-started' ? '#4B5563' : '#F9FAFB',
                      color: currentStatus === 'not-started' ? 'white' : '#4B5563'
                    }}
                    onClick={() => {
                      setCurrentStatus('not-started');
                      onStatusChange?.(book.id, 'not-started');
                    }}
                  >
                    📚 Not Started
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: currentStatus === 'reading' ? '#FACC15' : '#F9FAFB',
                      color: currentStatus === 'reading' ? 'white' : '#4B5563'
                    }}
                    onClick={() => {
                      setCurrentStatus('reading');
                      onStatusChange?.(book.id, 'reading');
                    }}
                  >
                    📖 Reading
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: currentStatus === 'completed' ? '#10B981' : '#F9FAFB',
                      color: currentStatus === 'completed' ? 'white' : '#4B5563'
                    }}
                    onClick={() => {
                      setCurrentStatus('completed');
                      onStatusChange?.(book.id, 'completed');
                    }}
                  >
                    ✅ Completed
                  </button>
                </div>
              </div>
            )}
            
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
              <button
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (book.previewLink) {
                    window.open(book.previewLink, '_blank');
                  } else {
                    alert('Premium Feature: This book requires a premium subscription to read!');
                  }
                }}
              >
                📖 Read Book
              </button>
              
              <button
                style={{
                  padding: '12px',
                  backgroundColor: isInLibrary ? '#10B981' : '#F3F4F6',
                  color: isInLibrary ? 'white' : '#4B5563',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
                onClick={handleSaveToLibrary}
              >
                {isInLibrary ? '🔖' : '📑'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};