import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookList from '../components/BookList';
import booksData from '../assets/fantasy.json';

import { vi } from 'vitest';

// Mock per i componenti figli
vi.mock('../components/SingleBook', () => {
  return function MockSingleBook({ asin, title, img, selected, onSelect }: any) {
    return (
      <div 
        data-testid={`book-${asin}`}
        className={`book-card ${selected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        <img src={img} alt={title} />
        <h3>{title}</h3>
      </div>
    );
  };
});

vi.mock('../components/CommentArea', () => {
  return function MockCommentArea({ asin }: any) {
    return (
      <div data-testid="comment-area" data-asin={asin}>
        <h4>Commenti per libro {asin}</h4>
        <div data-testid="comments-container"></div>
      </div>
    );
  };
});

describe('BookList Component', () => {
  beforeEach(() => {
    // Reset dei mock prima di ogni test
    vi.clearAllMocks();
  });

  test('Vengono renderizzate tante bootstrap cards quanti sono i libri nel file json utilizzato', () => {
    render(<BookList books={booksData} />);
    
    // Verifica che il titolo della sezione sia presente
    expect(screen.getByText(/La nostra collezione/i)).toBeInTheDocument();
    
    // Verifica che tutti i libri siano renderizzati
    booksData.forEach(book => {
      expect(screen.getByTestId(`book-${book.asin}`)).toBeInTheDocument();
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
    
    // Verifica che il numero di card corrisponda al numero di libri
    const bookCards = screen.getAllByTestId(/book-/);
    expect(bookCards).toHaveLength(booksData.length);
  });

  test('Il filtraggio dei libri tramite navbar si comporta come previsto', () => {
    render(<BookList books={booksData} />);
    
    const searchInput = screen.getByPlaceholderText(/Cerca per titolo/i);
    expect(searchInput).toBeInTheDocument();
    
    // Test con ricerca vuota - tutti i libri dovrebbero essere visibili
    fireEvent.change(searchInput, { target: { value: '' } });
    booksData.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
    
    // Test con ricerca parziale
    const firstBookTitle = booksData[0].title;
    const searchTerm = firstBookTitle.substring(0, 5); // Primi 5 caratteri
    fireEvent.change(searchInput, { target: { value: searchTerm } });
    
    // Verifica che solo i libri che contengono il termine di ricerca siano visibili
    const visibleBooks = booksData.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    visibleBooks.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
    
    // Verifica che i libri che non contengono il termine non siano visibili
    const hiddenBooks = booksData.filter(book => 
      !book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    hiddenBooks.forEach(book => {
      expect(screen.queryByText(book.title)).not.toBeInTheDocument();
    });
  });

  test('Cliccando su un libro, il suo bordo cambia colore', () => {
    render(<BookList books={booksData} />);
    
    const firstBook = screen.getByTestId(`book-${booksData[0].asin}`);
    
    // Verifica che inizialmente non sia selezionato
    expect(firstBook).not.toHaveClass('selected');
    
    // Clicca sul libro
    fireEvent.click(firstBook);
    
    // Verifica che ora sia selezionato
    expect(firstBook).toHaveClass('selected');
  });

  test('Cliccando su di un secondo libro dopo il primo, il bordo del primo libro ritorni normale', () => {
    render(<BookList books={booksData} />);
    
    const firstBook = screen.getByTestId(`book-${booksData[0].asin}`);
    const secondBook = screen.getByTestId(`book-${booksData[1].asin}`);
    
    // Clicca sul primo libro
    fireEvent.click(firstBook);
    expect(firstBook).toHaveClass('selected');
    expect(secondBook).not.toHaveClass('selected');
    
    // Clicca sul secondo libro
    fireEvent.click(secondBook);
    
    // Verifica che il primo libro non sia più selezionato
    expect(firstBook).not.toHaveClass('selected');
    // Verifica che il secondo libro sia selezionato
    expect(secondBook).toHaveClass('selected');
  });

  test('All\'avvio della pagina, senza aver ancora cliccato su nessun libro, non ci siano istanze del componente SingleComment all\'interno del DOM', () => {
    render(<BookList books={booksData} />);
    
    // Verifica che non ci sia nessuna area commenti visibile
    expect(screen.queryByTestId('comment-area')).not.toBeInTheDocument();
    
    // Verifica che il messaggio di selezione sia presente
    expect(screen.getByText(/Seleziona un libro/i)).toBeInTheDocument();
    expect(screen.getByText(/Per visualizzare i commenti, clicca su un libro dalla lista/i)).toBeInTheDocument();
  });

  test('Cliccando su di un libro con recensioni, esse vengano caricate correttamente all\'interno del DOM', async () => {
    // Mock della risposta API per i commenti
    const mockComments = [
      { _id: '1', comment: 'Ottimo libro!', rate: 5, elementId: booksData[0].asin },
      { _id: '2', comment: 'Molto interessante', rate: 4, elementId: booksData[0].asin }
    ];
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments
    });
    
    render(<BookList books={booksData} />);
    
    const firstBook = screen.getByTestId(`book-${booksData[0].asin}`);
    
    // Clicca sul libro
    fireEvent.click(firstBook);
    
    // Attendi che l'area commenti venga renderizzata
    await waitFor(() => {
      expect(screen.getByTestId('comment-area')).toBeInTheDocument();
    });
    
    // Verifica che l'area commenti abbia l'asin corretto
    const commentArea = screen.getByTestId('comment-area');
    expect(commentArea).toHaveAttribute('data-asin', booksData[0].asin);
    
    // Verifica che la fetch sia stata chiamata con l'URL corretto
    expect(global.fetch).toHaveBeenCalledWith(
      `https://striveschool-api.herokuapp.com/api/comments/${booksData[0].asin}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.any(String)
        })
      })
    );
  });

  test('Il componente CommentArea viene renderizzato correttamente quando si seleziona un libro', async () => {
    // Mock della risposta API
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    render(<BookList books={booksData} />);
    
    const firstBook = screen.getByTestId(`book-${booksData[0].asin}`);
    fireEvent.click(firstBook);
    
    await waitFor(() => {
      const commentArea = screen.getByTestId('comment-area');
      expect(commentArea).toBeInTheDocument();
      expect(commentArea).toHaveAttribute('data-asin', booksData[0].asin);
    });
  });
}); 