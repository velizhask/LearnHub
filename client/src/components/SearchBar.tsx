import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for educational books...",
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className || "")}>
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-elegant p-1">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 border-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
        <Button type="submit" size="sm" className="px-4">
          Search
        </Button>
        <Button type="button" variant="outline" size="sm" className="px-3">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};