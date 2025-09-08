import { useState } from "react";
import { BookCard, ReadingStatus } from "../components/BookCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BookOpen, Loader2 } from "lucide-react";
import { useLibrary } from "../contexts/LibraryContext";

export default function Library() {
  const { library, removeFromLibrary, updateReadingStatus, isLoading } = useLibrary();
  const [filter, setFilter] = useState<ReadingStatus | "all">("all");

  const handleStatusChange = async (bookId: string, status: ReadingStatus) => {
    await updateReadingStatus(bookId, status);
  };

  const handleRemoveFromLibrary = async (bookId: string) => {
    await removeFromLibrary(bookId);
  };

  const filteredBooks = library.filter(book => 
    filter === "all" || book.readingStatus === filter
  );

  const getFilteredCount = (status: ReadingStatus | "all") => {
    if (status === "all") return library.length;
    return library.filter(book => book.readingStatus === status).length;
  };

  const filters: Array<{ key: ReadingStatus | "all"; label: string; color?: string }> = [
    { key: "all", label: "All Books" },
    { key: "not-started", label: "Not Started", color: "bg-muted text-muted-foreground" },
    { key: "reading", label: "Currently Reading", color: "bg-warning text-warning-foreground" },
    { key: "completed", label: "Completed", color: "bg-success text-success-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            My Library
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your reading progress and manage your saved books
          </p>
        </div>

        {/* Stats & Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map(filterOption => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key)}
                className="flex items-center gap-2"
              >
                {filterOption.color && (
                  <div className={`w-2 h-2 rounded-full ${filterOption.color}`} />
                )}
                {filterOption.label}
                <Badge variant="secondary" className="text-xs">
                  {getFilteredCount(filterOption.key)}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading your library...</span>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => {
              const bookData = {
                id: book.bookId,
                title: book.title,
                authors: book.authors,
                description: book.description,
                imageLinks: { thumbnail: book.thumbnail }
              };
              return (
                <BookCard
                  key={book.bookId}
                  book={bookData}
                  readingStatus={book.readingStatus}
                  onStatusChange={(bookId, status) => handleStatusChange(bookId, status)}
                  onSaveToLibrary={() => handleRemoveFromLibrary(book.bookId)}
                  isInLibrary={true}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <BookOpen className="w-24 h-24 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filter === "all" ? "No books in your library yet" : `No ${filter.replace("-", " ")} books`}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {filter === "all" 
                ? "Start exploring books and add them to your library to track your reading progress."
                : `You don't have any ${filter.replace("-", " ")} books. Try changing the filter or add more books to your library.`
              }
            </p>
            {filter === "all" && (
              <Button asChild>
                <a href="/">Discover Books</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}