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

  // Mock fetch to simulate adding a todo
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(['Test Todo']),
    })
  );

  // Add a todo item
  const inputElement = screen.getByRole('textbox');
  const addButtonElement = screen.getByRole('button', { name: 'Add Todo' });
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  fireEvent.click(addButtonElement);

  // Mock fetch to simulate deleting a todo
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]), // Return an empty array to simulate deletion
    })
  );

  // Wait for the item to appear before trying to delete it
  const todoElement = await screen.findByText('Test Todo');
  expect(todoElement).toBeInTheDocument();

  // Simulate clicking the delete button next to the todo item
  const deleteButtonElement = screen.getByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButtonElement);

  // Assert that the todo item is removed from the document
  expect(todoElement).not.toBeInTheDocument();

  // Reset fetch mock
  global.fetch.mockRestore();
});

test('displays error message on failed deletion', async () => {
  render(<App />);

  // Mock fetch to simulate adding a todo
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(['Test Todo']),
    })
  );

  // Add a todo item
  const inputElement = screen.getByRole('textbox');
  const addButtonElement = screen.getByRole('button', { name: 'Add Todo' });
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  fireEvent.click(addButtonElement);

  // Mock fetch to simulate a failed deletion
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Failed to delete todo item')),
  );

  // Wait for the item to appear before trying to delete it
  const todoElement = await screen.findByText('Test Todo');
  expect(todoElement).toBeInTheDocument();

  // Simulate clicking the delete button next to the todo item
  const deleteButtonElement = screen.getByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButtonElement);

  // Assert that an error message is displayed
  const errorMessage = await screen.findByText(/failed to delete todo item/i);
  expect(errorMessage).toBeInTheDocument();

  // Assert that the todo item is still in the document
  expect(todoElement).toBeInTheDocument();

  // Reset fetch mock
  global.fetch.mockRestore();
});