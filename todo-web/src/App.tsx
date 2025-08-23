import { useEffect, useState } from 'react';
import AddToDoModel from './Components/AddToDoModel';
import { Sections } from './Components/Sections';
import './App.css';

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
    <div className="home-root d-flex flex-column align-items-center">
      <header className="text-center text-light mt-5 mb-4">
        <h1 className="fw-bold display-5">To do</h1>
        <button className="btn btn-primary mt-3" onClick={()=>setOpenWindow(true)}>
          <i className="bi bi-plus-lg me-1" />
          Add
        </button>
      </header>
      <main className="container-fluid flex-grow-1 d-flex align-items-stretch pb-5">
        <AddToDoModel open={openWindow} onClose={() => setOpenWindow(false)} onCreated={load} />
        <div className="row g-4 justify-content-center flex-grow-1">
          <div className="col-12 col-lg-6 d-flex">
            <Sections title="Active" taskArray={activeTasks} onToggle={toggle} onDelete={remove}/>
          </div>
          <div className="col-12 col-lg-6 d-flex">
            <Sections title='Incomplete' taskArray={completedTasks} onToggle={toggle} onDelete={remove}/>
          </div>
        </div>
      </main>
    </div>
  );
}
