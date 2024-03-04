import { render, fireEvent, screen } from '@testing-library/react';
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

  // Add a todo item first
  const inputElement = screen.getByRole('textbox');
  const addButtonElement = screen.getByText('Add Todo');
  fireEvent.change(inputElement, { target: { value: 'Test Todo to Delete' } });
  fireEvent.click(addButtonElement);

  // Wait for the item to be added
  const todoElement = await screen.findByText('Test Todo to Delete');
  expect(todoElement).toBeInTheDocument();

  // Assuming delete button is added next to each todo item
  const deleteButtonElement = screen.getByLabelText('Delete Test Todo to Delete');
  fireEvent.click(deleteButtonElement);

  // Wait for the item to be removed
  await expect(screen.queryByText('Test Todo to Delete')).not.toBeInTheDocument();
});