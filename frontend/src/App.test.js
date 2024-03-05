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

test('input validation for empty todo item', () => {
  render(<App />);

  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /add todo/i });

  // Initially, the button should be disabled
  expect(buttonElement).toBeDisabled();

  // Attempt to submit with empty input
  fireEvent.click(buttonElement);

  // Check for visual feedback indicating input cannot be blank
  const feedbackElement = screen.getByText(/input cannot be blank/i);
  expect(feedbackElement).toBeInTheDocument();
  expect(inputElement).toHaveClass('border-red-500'); // Assuming red border is used for feedback

  // Start typing in the input field
  fireEvent.change(inputElement, { target: { value: 'a' } });

  // Visual feedback should disappear, and button should be enabled
  expect(feedbackElement).not.toBeInTheDocument();
  expect(buttonElement).toBeEnabled();

  // Submit the form with non-empty input
  fireEvent.click(buttonElement);

  // Ensure the todo item is added and displayed
  const todoElement = screen.getByText('a');
  expect(todoElement).toBeInTheDocument();
});

test('adding a non-blank todo item after attempting to add a blank one', () => {
  render(<App />);

  const inputElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /add todo/i });

  // Attempt to submit with empty input first
  fireEvent.click(buttonElement);

  // Check for visual feedback
  const feedbackElement = screen.getByText(/input cannot be blank/i);
  expect(feedbackElement).toBeInTheDocument();

  // Now, input a valid todo item
  fireEvent.change(inputElement, { target: { value: 'Valid Todo' } });
  fireEvent.click(buttonElement);

  // The valid todo item should be added successfully
  const todoElement = screen.getByText('Valid Todo');
  expect(todoElement).toBeInTheDocument();
});