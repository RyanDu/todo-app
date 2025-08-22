import { useEffect, useState } from 'react';
import AddToDoModel from './Components/AddToDoModel';
import { Sections } from './Components/Sections';

export type Todo = { 
  id: number; 
  title: string; 
  description: string;
  isDone: boolean;
  categoryId: number; 
  taskStartTime: string;
  taskFinishTime: string;
  createdDateTime: string;
  modifiedDateTime: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [openWindow, setOpenWindow] = useState(false);

  const load = async () => {
    const res = await fetch('/api/todos');
    setTodos(await res.json());
  };

  useEffect(() => { load(); }, []);

  const completedTasks = todos.filter((task) => task.isDone);
  const activeTasks = todos.filter((task) => !task.isDone);

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
      <button onClick={() => setOpenWindow(true)} className='btn primary'>Add</button>
      <AddToDoModel open={openWindow} onClose={() => setOpenWindow(false)} onCreated={load} />
      <Sections title="Active" taskArray={activeTasks} onToggle={toggle} onDelete={remove}/>
      <Sections title='Incomplete' taskArray={completedTasks} onToggle={toggle} onDelete={remove}/>
    </main>
  );
}
