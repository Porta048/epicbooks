import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SingleComment from '../components/SingleComment';

describe('SingleComment Component', () => {
  const mockComment = {
    _id: 'test-comment-id',
    comment: 'Questo è un commento di test',
    rate: 4,
    elementId: 'test-asin'
  };
  
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Il componente SingleComment viene renderizzato correttamente', () => {
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    // Verifica che il commento e il rating siano visualizzati
    expect(screen.getByText('Questo è un commento di test')).toBeInTheDocument();
    expect(screen.getByText(/Voto: 4/i)).toBeInTheDocument();
    
    // Verifica che il pulsante di eliminazione sia presente
    expect(screen.getByText(/Elimina/i)).toBeInTheDocument();
  });

  test('Elimina correttamente il commento quando si clicca sul pulsante', async () => {
    // Mock della risposta API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });
    
    const user = userEvent.setup();
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByText(/Elimina/i);
    await user.click(deleteButton);
    
    // Verifica che la fetch sia stata chiamata correttamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `https://striveschool-api.herokuapp.com/api/comments/${mockComment._id}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: expect.any(String)
          })
        })
      );
    });
    
    // Verifica che onDelete sia stato chiamato con l'ID corretto
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockComment._id);
    });
  });

  test('Mostra stato di caricamento durante l\'eliminazione', async () => {
    // Mock di una risposta lenta
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    );
    
    const user = userEvent.setup();
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByText(/Elimina/i);
    await user.click(deleteButton);
    
    // Verifica che il pulsante mostri lo stato di caricamento
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  test('Gestisce correttamente gli errori di rete durante l\'eliminazione', async () => {
    // Mock di un errore di rete
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Errore di rete'));
    
    const user = userEvent.setup();
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByText(/Elimina/i);
    await user.click(deleteButton);
    
    // Verifica che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByText('Errore di rete')).toBeInTheDocument();
    });
    
    // Verifica che onDelete non sia stato chiamato
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('Gestisce correttamente le risposte non ok dall\'API durante l\'eliminazione', async () => {
    // Mock di una risposta non ok
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    
    const user = userEvent.setup();
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByText(/Elimina/i);
    await user.click(deleteButton);
    
    // Verifica che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByText('Errore nella cancellazione')).toBeInTheDocument();
    });
    
    // Verifica che onDelete non sia stato chiamato
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('Visualizza correttamente commenti con rating diversi', () => {
    const commentsWithDifferentRatings = [
      { ...mockComment, rate: 1 },
      { ...mockComment, rate: 3 },
      { ...mockComment, rate: 5 }
    ];
    
    commentsWithDifferentRatings.forEach((comment, index) => {
      const { unmount } = render(<SingleComment comment={comment} onDelete={mockOnDelete} />);
      
      expect(screen.getByText(new RegExp(`Voto: ${comment.rate}`))).toBeInTheDocument();
      expect(screen.getByText(comment.comment)).toBeInTheDocument();
      
      unmount();
    });
  });

  test('Il pulsante di eliminazione è disabilitato durante il caricamento', async () => {
    // Mock di una risposta lenta
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    );
    
    const user = userEvent.setup();
    render(<SingleComment comment={mockComment} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByText(/Elimina/i);
    await user.click(deleteButton);
    
    // Verifica che il pulsante sia disabilitato
    expect(deleteButton).toBeDisabled();
    
    // Verifica che il testo del pulsante sia cambiato
    expect(screen.getByText('...')).toBeInTheDocument();
  });
}); 