import { useEffect, useState } from 'react';

type Todo = { id: number; title: string; isDone: boolean; createdAt: string };

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const res = await fetch('/api/todos');
    setTodos(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, isDone: false })
    });
    setTitle('');
    await load();
  };

  const toggle = async (id: number, isDone: boolean, title: string) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, title, isDone: !isDone })
    });
    await load();
  };

  const remove = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Todo</h1>
      <div style={{ display:'flex', gap:8 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Add a task..." style={{ flex:1 }} />
        <button onClick={add}>Add</button>
      </div>
      <ul>
        {todos.map(t => (
          <li key={t.id} style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input type="checkbox" checked={t.isDone} onChange={()=>toggle(t.id, t.isDone, t.title)} />
            <span style={{ textDecoration: t.isDone ? 'line-through' : 'none' }}>{t.title}</span>
            <button onClick={()=>remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
