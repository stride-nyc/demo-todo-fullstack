import React, { useState, useEffect } from 'react';
import './App.css';
import StrideLogo from './stride-logo-white.png';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const fetchTodoList = async () => {
    setTodos(
      await fetch('http://localhost:4000/api/todos')
        .then((resp) => resp.json())
        .catch((err) => [])
    );
  }

  const createTodoItem = async (todo) => {
    setTodos(
      await fetch('http://localhost:4000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo }),
      }).then((resp) => resp.json()).catch((err) => [])
    );
  }

  useEffect(() => {
    fetchTodoList();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    await createTodoItem(input);
    // setTodos([...todos, input]);
    setInput('');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
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
            <label htmlFor="todo-description">Todo Description</label>
            <input
              id="todo-description"
              value={input}
              onChange={handleInputChange}
              className='input input-bordered w-full max-w-xs mx-4'
            />

            <button type='submit' className='btn mx-4'>
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
