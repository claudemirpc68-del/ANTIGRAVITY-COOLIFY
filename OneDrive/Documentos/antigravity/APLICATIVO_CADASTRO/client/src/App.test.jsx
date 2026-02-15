import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import ClientForm from './components/ClientForm';

// Mock API
vi.mock('./services/api', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] })),
        post: vi.fn(() => Promise.resolve({ data: {} })),
    },
}));

describe('App Component', () => {
    it('renders title', () => {
        render(<App />);
        expect(screen.getByText('Client Management System')).toBeInTheDocument();
    });
});

describe('ClientForm Component', () => {
    it('renders form inputs', () => {
        render(<ClientForm onClientAdded={() => { }} />);
        expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone:/i)).toBeInTheDocument();
    });

    it('updates input values', () => {
        render(<ClientForm onClientAdded={() => { }} />);
        const nameInput = screen.getByLabelText(/Name:/i);
        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        expect(nameInput.value).toBe('Test User');
    });
});
