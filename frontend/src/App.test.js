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
test('delete button is visible next to each todo item', async () => {
  render(<App />);

  // Mock fetch to simulate fetching todos
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, description: 'Test Todo 1' }, { id: 2, description: 'Test Todo 2' }]),
    })
  );

  // Wait for the todos to be fetched and rendered
  const todoItems = await screen.findAllByText(/Test Todo/);
  expect(todoItems.length).toBeGreaterThan(0);

  // Check if each todo item has a delete button next to it
  todoItems.forEach(async (item, index) => {
    const deleteButton = await screen.findAllByRole('button', { name: 'Delete' });
    expect(deleteButton[index]).toBeInTheDocument();
  });

  // Reset fetch mock
  global.fetch.mockRestore();
});

test('clicking delete button sends DELETE request', async () => {
  render(<App />);

  // Mock fetch to simulate fetching and deleting todos
  global.fetch = jest.fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, description: 'Test Todo' }]),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ status: 204 })
    );

  // Wait for the todo item to be fetched and rendered
  const todoItem = await screen.findByText('Test Todo');
  expect(todoItem).toBeInTheDocument();

  // Simulate clicking the delete button next to the todo item
  const deleteButtonElement = screen.getByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButtonElement);

  // Assert that a DELETE request was sent
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/todos/1'), expect.objectContaining({ method: 'DELETE' }));

  // Reset fetch mock
  global.fetch.mockRestore();
});

test('frontend updates without refresh on successful deletion', async () => {
  render(<App />);

  // Mock fetch to simulate fetching and deleting todos
  global.fetch = jest.fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, description: 'Test Todo' }]),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ status: 204 })
    );

  // Wait for the todo item to be fetched and rendered
  const todoItem = await screen.findByText('Test Todo');
  expect(todoItem).toBeInTheDocument();

  // Simulate clicking the delete button next to the todo item
  const deleteButtonElement = screen.getByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButtonElement);

  // Assert that the todo item is removed from the document
  await waitFor(() => expect(todoItem).not.toBeInTheDocument());

  // Reset fetch mock
  global.fetch.mockRestore();
});

test('user receives confirmation message on successful deletion', async () => {
  window.alert = jest.fn();

  render(<App />);

  // Mock fetch to simulate fetching and deleting todos
  global.fetch = jest.fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, description: 'Test Todo' }]),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ status: 204 })
    );

  // Simulate clicking the delete button next to the todo item
  const deleteButtonElement = await screen.findByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButtonElement);

  // Assert that a confirmation message is shown
  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('successfully deleted'));

  // Reset mocks
  global.fetch.mockRestore();
  window.alert.mockRestore();
});