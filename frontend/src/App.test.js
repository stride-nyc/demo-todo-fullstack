import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('adds a todo item', () => {
  render(<App />);
  
  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /add todo/i });
  
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  fireEvent.click(buttonElement);
  
  const todoElement = screen.getByText('Test Todo');
  
  expect(todoElement).toBeInTheDocument();
});

test('Add Todo button is disabled when input is empty', () => {
  render(<App />);
  
  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /add todo/i });
  
  // Initially, the input is empty, so the button should be disabled
  expect(buttonElement).toBeDisabled();
  
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  
  // After input, the button should be enabled
  expect(buttonElement).not.toBeDisabled();
});

test('Visual feedback is provided when trying to add an empty todo item', () => {
  render(<App />);
  
  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /add todo/i });
  
  // Attempt to add a todo with empty input
  fireEvent.click(buttonElement);
  
  // Expect visual feedback indicating that a name is required
  const feedbackElement = screen.getByText(/name is required/i);
  expect(feedbackElement).toBeInTheDocument();
});
