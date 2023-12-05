import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    setTodos([...todos, input]);
    setInput('');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleAddTodo}>
          <input value={input} onChange={handleInputChange} />
          <button type="submit">Add Todo</button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;