import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';

test('adds a todo item', () => {
  render(<App />);
  
  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button');
  
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  fireEvent.click(buttonElement);
  
  const todoElement = screen.getByText('Test Todo');
  
  expect(todoElement).toBeInTheDocument();
});

test('deletes a todo item', async () => {
  render(<App />);

  // Assuming there's already a todo item added for simplicity
  const todoElement = screen.getByText('Test Todo');
  expect(todoElement).toBeInTheDocument();

  // Assuming there's a delete button for each todo item
  const deleteButton = screen.getByLabelText('Delete Test Todo');
  fireEvent.click(deleteButton);

  // Wait for the item to be removed from the document
  await waitFor(() => {
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
  });
});