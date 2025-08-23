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

const toServerShape = (t: Todo) => ({
  Id: t.id,
  Title: t.title,
  Description: t.description,
  IsDone: t.isDone,
  CategoryId: t.categoryId,
  TaskStartTime: t.taskStartTime,
  TaskFinishTime: t.taskFinishTime,
  CreatedDateTime: t.createdDateTime,
  ModifiedDateTime: t.modifiedDateTime,
});

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

  const onTaskChange = async (task: Todo, patch: Partial<Todo>) => {
    try{
        const merged: Todo = {
        ...task,
        ...patch,
        modifiedDateTime: new Date().toISOString(),
      };

      const payload = toServerShape(merged);

      const res = await fetch(`/api/todos/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Update failed:", res.status, await res.text());
        return;
      }
      await load();
    }
    catch(e){
      console.error(e);
    }
  };

  const remove = async (id: number) => {
    try{
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      await load();
    }
    catch(e){
      console.error(e);
    }
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
            <Sections title="Active" taskArray={activeTasks} onTaskChange={onTaskChange} onDelete={remove}/>
          </div>
          <div className="col-12 col-lg-6 d-flex">
            <Sections title='Incomplete' taskArray={completedTasks} onTaskChange={onTaskChange} onDelete={remove}/>
          </div>
        </div>
      </main>
    </div>
  );
}
