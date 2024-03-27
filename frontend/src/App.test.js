import { render, fireEvent, screen } from '@testing-library/react';
import nock from 'nock';
import App from './App';


test('adds a todo item', async () => {
  nock('http://localhost:4000').get('/api/todos').reply(200, [], {'Access-Control-Allow-Origin': '*'});
  nock('http://localhost:4000').post('/api/todos').reply(200, ['Test Todo'], {'Access-Control-Allow-Origin': '*'});

  render(<App />);
  
  const inputElement = screen.getByRole('textbox', { name: /todo description/i});
  const buttonElement = screen.getByRole('button', { name: /add todo/i});
  
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  fireEvent.click(buttonElement);
  
  const todoElement = await screen.findByText(/test todo/i);
  
  expect(todoElement).toBeInTheDocument();
});