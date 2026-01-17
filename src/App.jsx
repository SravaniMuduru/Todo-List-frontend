import { useEffect, useState } from "react";
import "./index.css";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

//const API_URL = "http://localhost:5000/todos";
const API_URL="process.env.REACT_APP_API_URL";
export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  // 🚪 Logout
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setTodos([]);
  }

  // 📥 Load todos
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function loadTodos() {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          logout();
          return;
        }

        let data = await res.json();

        if (currentFilter === "active") data = data.filter(t => !t.completed);
        else if (currentFilter === "completed") data = data.filter(t => t.completed);

        if (isMounted) setTodos(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadTodos();
    return () => { isMounted = false; };
  }, [token, currentFilter]);

  // ➕ Add todo
  async function addTodo() {
    if (!text.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newTodo = await res.json();
      setTodos(prev => [newTodo, ...prev]);
      setText("");
      setCurrentFilter("all");
    }
  }

  // ❌ Delete todo
  async function deleteTodo(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setCurrentFilter("all");
  }

  // ✔ Toggle completed
  async function toggleTodo(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    setTodos(prev =>
      prev.map(todo =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // ✏ Save edit
  async function saveEdit(id) {
    if (!editText.trim()) return;

    const res = await fetch(`${API_URL}/${id}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editText }),
    });

    if (res.ok) {
      setEditingTodoId(null);
      setCurrentFilter(prev => prev);
    }
  }

  // 🔐 Auth screens
  if (!token) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} setToken={setToken} />
    ) : (
      <Login setShowSignup={setShowSignup} setToken={setToken} />
    );
  }

  // ✅ Main UI
  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="todo-container">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        <button onClick={() => setCurrentFilter("all")}>All</button>
        <button onClick={() => setCurrentFilter("active")}>Active</button>
        <button onClick={() => setCurrentFilter("completed")}>Completed</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {editingTodoId === todo._id ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(todo._id)}
                />
                <button onClick={() => saveEdit(todo._id)}>💾</button>
              </>
            ) : (
              <>
                <div className="todo-left">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id)}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.text}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setEditingTodoId(todo._id);
                      setEditText(todo.text);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* ✅ Logout BELOW todos */}
      <div className="logout-container">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
