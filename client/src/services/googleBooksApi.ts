import { booksAPI } from './api';
import { Book } from '../components/BookCard';

export const searchBooks = async (
  query: string, 
  startIndex: number = 0, 
  maxResults: number = 20,
  retryCount: number = 0
): Promise<{ books: Book[]; totalItems: number }> => {
  try {
    const response = await booksAPI.search(query, startIndex, maxResults);
    const books: Book[] = response.data.books?.map((book: any) => ({
      id: book.id,
      title: book.title,
      authors: book.authors,
      description: book.description,
      imageLinks: { thumbnail: book.thumbnail },
      averageRating: book.averageRating,
      publishedDate: book.publishedDate,
      categories: book.categories,
      previewLink: book.previewLink
    })) || [];

    return {
      books,
      totalItems: books.length
    };
  } catch (error: any) {
    console.error('Error fetching books:', error);
    
    // Retry logic for rate limits or network errors
    if (retryCount < 3 && (error.response?.status === 429 || !error.response)) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying search in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return searchBooks(query, startIndex, maxResults, retryCount + 1);
    }
    
    // Return empty results instead of throwing
    return { books: [], totalItems: 0 };
  }
};

export const getEducationalBooks = async (
  startIndex: number = 0,
  maxResults: number = 20
): Promise<{ books: Book[]; totalItems: number }> => {
  const educationalQueries = [
    'education',
    'science',
    'mathematics',
    'history',
    'programming',
    'psychology',
    'philosophy',
    'literature'
  ];
  
  const randomQuery = educationalQueries[Math.floor(Math.random() * educationalQueries.length)];
  return searchBooks(randomQuery, startIndex, maxResults);
};

export const getFeaturedBooks = async (retryCount: number = 0): Promise<Book[]> => {
  try {
    const response = await booksAPI.getFeatured();
    console.log('Featured books response:', response.data);
    const books: Book[] = response.data.books?.map((book: any) => ({
      id: book.id,
      title: book.title,
      authors: book.authors,
      description: book.description,
      imageLinks: { thumbnail: book.thumbnail },
      averageRating: book.averageRating,
      publishedDate: book.publishedDate,
      categories: book.categories,
      previewLink: book.previewLink
    })) || [];

    return books;
  } catch (error: any) {
    console.error('Error fetching featured books:', error);
    
    // Retry logic for rate limits or network errors
    if (retryCount < 2 && (error.response?.status === 429 || !error.response)) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying featured books in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getFeaturedBooks(retryCount + 1);
    }
    
    return [];
  }
};