import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddComment from '../components/AddComment';

describe('AddComment Component', () => {
  const mockOnAdd = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Il componente AddComment viene renderizzato correttamente', () => {
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    // Verifica che tutti gli elementi del form siano presenti
    expect(screen.getByPlaceholderText(/Scrivi una recensione/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // select per il rating
    expect(screen.getByText(/Aggiungi commento/i)).toBeInTheDocument();
    
    // Verifica che le opzioni del rating siano presenti
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    ['1', '2', '3', '4', '5'].forEach(rating => {
      expect(screen.getByText(rating)).toBeInTheDocument();
    });
  });

  test('Permette di inserire testo nel textarea', async () => {
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const textarea = screen.getByPlaceholderText(/Scrivi una recensione/i);
    await user.type(textarea, 'Questo è un commento di test');
    
    expect(textarea).toHaveValue('Questo è un commento di test');
  });

  test('Permette di cambiare il rating', async () => {
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');
    
    expect(select).toHaveValue('5');
  });

  test('Invia correttamente il commento quando il form viene sottomesso', async () => {
    // Mock della risposta API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: 'new-comment-id' })
    });
    
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const textarea = screen.getByPlaceholderText(/Scrivi una recensione/i);
    const select = screen.getByRole('combobox');
    const submitButton = screen.getByText(/Aggiungi commento/i);
    
    // Inserisci dati nel form
    await user.type(textarea, 'Commento di test');
    await user.selectOptions(select, '4');
    
    // Sottometti il form
    await user.click(submitButton);
    
    // Verifica che la fetch sia stata chiamata correttamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://striveschool-api.herokuapp.com/api/comments/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: expect.any(String)
          }),
          body: JSON.stringify({
            comment: 'Commento di test',
            rate: 4,
            elementId: 'test-asin'
          })
        })
      );
    });
    
    // Verifica che onAdd sia stato chiamato
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
    
    // Verifica che il form sia stato resettato
    expect(textarea).toHaveValue('');
    expect(select).toHaveValue('1');
  });

  test('Mostra stato di caricamento durante l\'invio', async () => {
    // Mock di una risposta lenta
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    );
    
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const textarea = screen.getByPlaceholderText(/Scrivi una recensione/i);
    const submitButton = screen.getByText(/Aggiungi commento/i);
    
    await user.type(textarea, 'Commento di test');
    await user.click(submitButton);
    
    // Verifica che il pulsante mostri lo stato di caricamento
    expect(screen.getByText(/Invio/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('Gestisce correttamente gli errori di rete', async () => {
    // Mock di un errore di rete
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Errore di rete'));
    
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const textarea = screen.getByPlaceholderText(/Scrivi una recensione/i);
    const submitButton = screen.getByText(/Aggiungi commento/i);
    
    await user.type(textarea, 'Commento di test');
    await user.click(submitButton);
    
    // Verifica che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByText('Errore di rete')).toBeInTheDocument();
    });
    
    // Verifica che onAdd non sia stato chiamato
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('Gestisce correttamente le risposte non ok dall\'API', async () => {
    // Mock di una risposta non ok
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400
    });
    
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const textarea = screen.getByPlaceholderText(/Scrivi una recensione/i);
    const submitButton = screen.getByText(/Aggiungi commento/i);
    
    await user.type(textarea, 'Commento di test');
    await user.click(submitButton);
    
    // Verifica che l'errore venga mostrato
    await waitFor(() => {
      expect(screen.getByText('Errore nell\'invio del commento')).toBeInTheDocument();
    });
    
    // Verifica che onAdd non sia stato chiamato
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('Non permette l\'invio di commenti vuoti', async () => {
    const user = userEvent.setup();
    render(<AddComment asin="test-asin" onAdd={mockOnAdd} />);
    
    const submitButton = screen.getByText(/Aggiungi commento/i);
    
    // Prova a inviare senza testo
    await user.click(submitButton);
    
    // Verifica che la fetch non sia stata chiamata
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
}); 