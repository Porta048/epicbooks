import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from '../routes/index';
import booksData from '../assets/fantasy.json';

// Mock per i componenti che fanno chiamate API
jest.mock('../components/CommentArea', () => {
  return function MockCommentArea({ asin }: any) {
    return (
      <div data-testid="comment-area" data-asin={asin}>
        <h4>Commenti per libro {asin}</h4>
        <div data-testid="comments-container">
          <div data-testid="comment-1">Commento 1 - Voto: 5</div>
          <div data-testid="comment-2">Commento 2 - Voto: 4</div>
        </div>
      </div>
    );
  };
});

jest.mock('../components/AddComment', () => {
  return function MockAddComment({ asin, onAdd }: any) {
    return (
      <div data-testid="add-comment" data-asin={asin}>
        <button onClick={onAdd}>Aggiungi Commento</button>
      </div>
    );
  };
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('L\'applicazione si carica correttamente e mostra tutti i componenti principali', () => {
    render(<Route.component />);
    
    // Verifica che la navbar sia presente
    expect(screen.getByText(/EpicBooks/i)).toBeInTheDocument();
    
    // Verifica che il componente Welcome sia presente
    expect(screen.getByText(/Benvenuto su EpicBooks!/i)).toBeInTheDocument();
    
    // Verifica che la sezione libri sia presente
    expect(screen.getByText(/La nostra collezione/i)).toBeInTheDocument();
    
    // Verifica che tutti i libri siano renderizzati
    booksData.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
    
    // Verifica che il footer sia presente
    expect(screen.getByText(/© \d{4} EpicBooks/i)).toBeInTheDocument();
  });

  test('Il flusso completo di selezione libro e visualizzazione commenti funziona correttamente', async () => {
    render(<Route.component />);
    
    // Verifica che inizialmente non ci sia nessuna area commenti
    expect(screen.queryByTestId('comment-area')).not.toBeInTheDocument();
    expect(screen.getByText(/Seleziona un libro/i)).toBeInTheDocument();
    
    // Seleziona il primo libro
    const firstBook = screen.getByText(booksData[0].title).closest('.book-card') || 
                     screen.getByText(booksData[0].title).parentElement;
    fireEvent.click(firstBook!);
    
    // Verifica che l'area commenti venga renderizzata
    await waitFor(() => {
      expect(screen.getByTestId('comment-area')).toBeInTheDocument();
    });
    
    // Verifica che l'area commenti abbia l'asin corretto
    const commentArea = screen.getByTestId('comment-area');
    expect(commentArea).toHaveAttribute('data-asin', booksData[0].asin);
    
    // Verifica che i commenti siano presenti
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
    
    // Verifica che il componente AddComment sia presente
    expect(screen.getByTestId('add-comment')).toBeInTheDocument();
  });

  test('Il filtraggio funziona correttamente e aggiorna la visualizzazione', () => {
    render(<Route.component />);
    
    const searchInput = screen.getByPlaceholderText(/Cerca per titolo/i);
    
    // Test con ricerca vuota
    fireEvent.change(searchInput, { target: { value: '' } });
    booksData.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
    
    // Test con ricerca specifica
    const searchTerm = booksData[0].title.substring(0, 3);
    fireEvent.change(searchInput, { target: { value: searchTerm } });
    
    // Verifica che solo i libri che contengono il termine siano visibili
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

  test('La selezione di libri diversi funziona correttamente', async () => {
    render(<Route.component />);
    
    const firstBook = screen.getByText(booksData[0].title).closest('.book-card') || 
                     screen.getByText(booksData[0].title).parentElement;
    const secondBook = screen.getByText(booksData[1].title).closest('.book-card') || 
                      screen.getByText(booksData[1].title).parentElement;
    
    // Seleziona il primo libro
    fireEvent.click(firstBook!);
    await waitFor(() => {
      expect(screen.getByTestId('comment-area')).toBeInTheDocument();
    });
    
    const firstCommentArea = screen.getByTestId('comment-area');
    expect(firstCommentArea).toHaveAttribute('data-asin', booksData[0].asin);
    
    // Seleziona il secondo libro
    fireEvent.click(secondBook!);
    await waitFor(() => {
      expect(screen.getByTestId('comment-area')).toBeInTheDocument();
    });
    
    const secondCommentArea = screen.getByTestId('comment-area');
    expect(secondCommentArea).toHaveAttribute('data-asin', booksData[1].asin);
  });

  test('L\'interfaccia utente risponde correttamente alle interazioni', async () => {
    const user = userEvent.setup();
    render(<Route.component />);
    
    // Test della ricerca con userEvent
    const searchInput = screen.getByPlaceholderText(/Cerca per titolo/i);
    await user.type(searchInput, 'test');
    
    // Verifica che la ricerca funzioni
    expect(searchInput).toHaveValue('test');
    
    // Test della selezione libro con userEvent
    const firstBook = screen.getByText(booksData[0].title).closest('.book-card') || 
                     screen.getByText(booksData[0].title).parentElement;
    await user.click(firstBook!);
    
    // Verifica che l'area commenti venga renderizzata
    await waitFor(() => {
      expect(screen.getByTestId('comment-area')).toBeInTheDocument();
    });
  });
}); 