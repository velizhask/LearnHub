import { useState, useEffect } from "react";
import { BookCard, Book, ReadingStatus } from "../components/BookCard";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { searchBooks, getFeaturedBooks } from "../services/googleBooksApi";
import { useToast } from "../hooks/use-toast";
import { useLibrary } from "../contexts/LibraryContext";
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  ArrowRight,
  Loader2
} from "lucide-react";

interface LibraryBook extends Book {
  readingStatus: ReadingStatus;
  addedDate: string;
}

const Index = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { library, addToLibrary, removeFromLibrary, updateReadingStatus, isInLibrary } = useLibrary();

  // Load featured books on component mount
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setIsLoading(true);
      try {
        const books = await getFeaturedBooks();
        setFeaturedBooks(books);
      } catch (error) {
        console.error('Failed to load featured books:', error);
        toast({
          title: "Error",
          description: "Failed to load featured books. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, [toast]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    try {
      const { books } = await searchBooks(query);
      setSearchResults(books);
      toast({
        title: "Search completed",
        description: `Found ${books.length} books for "${query}"`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to search books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = async (book: Book) => {
    const bookInLibrary = isInLibrary(book.id);
    
    if (bookInLibrary) {
      await removeFromLibrary(book.id);
    } else {
      await addToLibrary(book);
    }
  };

  const handleStatusChange = async (bookId: string, status: ReadingStatus) => {
    await updateReadingStatus(bookId, status);
  };

  const isBookInLibrary = (bookId: string) => {
    return isInLibrary(bookId);
  };

  const getBookStatus = (bookId: string): ReadingStatus => {
    const book = library.find(book => book.bookId === bookId);
    return book?.readingStatus || "not-started";
  };

  const stats = [
    { icon: BookOpen, label: "Books Available", value: "10M+", color: "text-primary" },
    { icon: Users, label: "Active Learners", value: "50K+", color: "text-accent" },
    { icon: Target, label: "Learning Goals", value: "100K+", color: "text-success" },
    { icon: TrendingUp, label: "Success Rate", value: "94%", color: "text-warning" },
  ];

  const displayBooks = searchResults.length > 0 ? searchResults : featuredBooks;
  const sectionTitle = searchResults.length > 0 
    ? `Search Results for "${searchQuery}"` 
    : "Featured Educational Books";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/10 to-accent/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-6 bg-background/80 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover Educational Resources
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Personal
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Learning Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover, save, and track your progress through thousands of educational books. 
              Build your personal library and achieve your learning goals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{sectionTitle}</h2>
              <p className="text-muted-foreground">
                {searchResults.length > 0 
                  ? `${searchResults.length} books found`
                  : "Handpicked educational resources to accelerate your learning"
                }
              </p>
            </div>
            {searchResults.length === 0 && (
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading books...</span>
            </div>
          ) : displayBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  readingStatus={getBookStatus(book.id)}
                  onStatusChange={handleStatusChange}
                  onSaveToLibrary={handleSaveToLibrary}
                  isInLibrary={isBookInLibrary(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-24 h-24 mx-auto text-muted-foreground/50 mb-6" />
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : "Unable to load books at the moment. Please try again later."
                }
              </p>
              {searchQuery && (
                <Button onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!searchResults.length && (
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners who are advancing their knowledge every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="shadow-elegant hover:shadow-glow"
                onClick={() => {
                  const searchBar = document.querySelector('input[placeholder*="Search"]');
                  if (searchBar) {
                    searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (searchBar as HTMLInputElement).focus();
                  }
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Books
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/profile?section=reading-goals'}
              >
                <Target className="w-5 h-5 mr-2" />
                Set Reading Goals
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;