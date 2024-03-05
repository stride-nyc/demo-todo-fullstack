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

test('delete button is visible next to each Todo item', () => {
  render(<App />);
  
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  
  expect(deleteButtons.length).toBeGreaterThan(0);
});

test('clicking the delete button removes the item from the list', async () => {
  render(<App />);
  
  // Assuming there's at least one todo item for this test to be meaningful
  const initialTodoItems = await screen.findAllByText(/todo/i);
  const initialCount = initialTodoItems.length;
  
  const firstDeleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
  fireEvent.click(firstDeleteButton);
  
  const updatedTodoItems = await screen.findAllByText(/todo/i);
  expect(updatedTodoItems.length).toBe(initialCount - 1);
});

// This test assumes the backend and frontend are correctly integrated and the backend is running
test('deletion persists after page refresh', async () => {
  render(<App />);
  
  const deleteButtonsBefore = screen.getAllByRole('button', { name: /delete/i });
  if (deleteButtonsBefore.length > 0) {
    fireEvent.click(deleteButtonsBefore[0]);
  }
  
  // Simulate a page refresh
  render(<App />);
  
  const deleteButtonsAfter = await screen.findAllByRole('button', { name: /delete/i });
  expect(deleteButtonsAfter.length).toBe(deleteButtonsBefore.length - 1);
});