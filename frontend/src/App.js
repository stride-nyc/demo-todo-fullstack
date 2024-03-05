import React, { useState, useEffect } from 'react';
import './App.css';
import StrideLogo from './stride-logo-white.png';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState(false);

  const fetchTodoList = async () =>
    setTodos(
      await fetch('http://localhost:4000/api/todos')
        .then((resp) => resp.json())
        .catch((err) => [])
    );

  const createTodoItem = async (todo) =>
    setTodos(
      await fetch('http://localhost:4000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo }),
      }).then((resp) => resp.json())
    );

  useEffect(() => {
    fetchTodoList();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (input.trim() === '') {
      setInputError(true);
      return;
    }
    await createTodoItem(input);
    setInput('');
    setInputError(false);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    if (inputError) setInputError(false);
  };

  return (
    <div className='App'>
      <header className='App-Logo flex justify-center'>
        <img src={StrideLogo} alt='Stride' />
      </header>
      <p className='TextColor text-5xl'>What would you like to do?</p>

      <div className='mx-auto w-1/2'>
        <div>
          <form onSubmit={handleAddTodo} className='space-y-4'>
            <input
              value={input}
              onChange={handleInputChange}
              className={`input input-bordered w-full max-w-xs mx-4 ${inputError ? 'border-red-500' : ''}`}
              aria-invalid={inputError}
              aria-describedby={inputError ? 'input-error' : undefined}
            />
            {inputError && <p id='input-error' className='text-red-500'>Input cannot be blank</p>}
            <button type='submit' className='btn mx-4' disabled={!input.trim()}>
              Add Todo
            </button>
          </form>
        </div>

        <div>
          <ul>
            {todos.map((todo, index) => (
              <li
                className='TextColor text-xl text-left mx-auto w-3/5 pt-4'
                key={index}
              >
                &#x2022; {todo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
