import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CommentArea from '../components/CommentArea';
import { vi } from 'vitest';

// Mock per i componenti figli
vi.mock('../components/CommentsList', () => {
  return function MockCommentsList({ comments, onDelete }: any) {
    return (
      <div data-testid="comments-list">
        {comments.map((comment: any) => (
          <div key={comment._id} data-testid={`comment-${comment._id}`}>
            {comment.comment} - Voto: {comment.rate}
          </div>
        ))}
      </div>
    );
  };
});

vi.mock('../components/AddComment', () => {
  return function MockAddComment({ asin, onAdd }: any) {
    return (
      <div data-testid="add-comment" data-asin={asin}>
        <button onClick={onAdd}>Aggiungi Commento</button>
      </div>
    );
  };
});

vi.mock('../components/Loading', () => {
  return function MockLoading() {
    return <div data-testid="loading">Caricamento...</div>;
  };
});

vi.mock('../components/Error', () => {
  return function MockError({ message }: any) {
    return <div data-testid="error">{message}</div>;
  };
});

describe('CommentArea Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Il componente CommentArea viene renderizzato correttamente', async () => {
    // Mock della risposta API
    const mockComments = [
      { _id: '1', comment: 'Ottimo libro!', rate: 5, elementId: 'test-asin' },
      { _id: '2', comment: 'Molto interessante', rate: 4, elementId: 'test-asin' }
    ];
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments
    });
    
    render(<CommentArea asin="test-asin" />);
    
    // Verifica che il componente di caricamento sia presente inizialmente
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Attendi che i commenti vengano caricati
    await waitFor(() => {
      expect(screen.getByTestId('comments-list')).toBeInTheDocument();
    });
    
    // Verifica che i commenti siano renderizzati
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
    
    // Verifica che il componente AddComment sia presente
    expect(screen.getByTestId('add-comment')).toBeInTheDocument();
    
    // Verifica che la fetch sia stata chiamata correttamente
    expect(global.fetch).toHaveBeenCalledWith(
      'https://striveschool-api.herokuapp.com/api/comments/test-asin',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.any(String)
        })
      })
    );
  });

  test('Gestisce correttamente gli errori di rete', async () => {
    // Mock di un errore di rete
    (global.fetch as any).mockRejectedValueOnce(new Error('Errore di rete'));
    
    render(<CommentArea asin="test-asin" />);
    
    // Attendi che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Errore di rete')).toBeInTheDocument();
  });

  test('Gestisce correttamente le risposte non ok dall\'API', async () => {
    // Mock di una risposta non ok
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    
    render(<CommentArea asin="test-asin" />);
    
    // Attendi che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Errore nel recupero dei commenti')).toBeInTheDocument();
  });

  test('Ricarica i commenti quando cambia l\'asin', async () => {
    // Mock per il primo asin
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: '1', comment: 'Primo libro', rate: 5, elementId: 'asin1' }]
    });
    
    const { rerender } = render(<CommentArea asin="asin1" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('comments-list')).toBeInTheDocument();
    });
    
    // Mock per il secondo asin
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: '2', comment: 'Secondo libro', rate: 4, elementId: 'asin2' }]
    });
    
    // Rerender con un nuovo asin
    rerender(<CommentArea asin="asin2" />);
    
    // Verifica che la fetch sia stata chiamata per il nuovo asin
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://striveschool-api.herokuapp.com/api/comments/asin2',
        expect.any(Object)
      );
    });
  });
}); 