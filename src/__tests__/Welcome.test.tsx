import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from '../components/Welcome';

describe('Welcome Component', () => {
  test('Il componente Welcome viene montato correttamente', () => {
    render(<Welcome />);
    
    // Verifica che il titolo principale sia presente
    expect(screen.getByText(/Benvenuto su EpicBooks!/i)).toBeInTheDocument();
    
    // Verifica che il sottotitolo sia presente
    expect(screen.getByText(/Scopri la nostra vasta collezione di libri fantastici./i)).toBeInTheDocument();
    
    // Verifica che il titolo secondario sia presente
    expect(screen.getByText(/Il tuo negozio di libri fantasy/i)).toBeInTheDocument();
    
    // Verifica che la descrizione sia presente
    expect(screen.getByText(/Trova i migliori titoli fantasy selezionati per te/i)).toBeInTheDocument();
    
    // Verifica che il pulsante sia presente
    expect(screen.getByText(/Esplora ora/i)).toBeInTheDocument();
  });
}); 