import type {Todo} from "../App";

export function Card({task, onToggle, onDelete} 
: {
    task: Todo;
    onToggle: (id: number, isDone: boolean, title: string)=>void;
    onDelete: (id: number) => void;
}){
    return(
        <div className="card">
            <h4>{task.title}</h4>
            <label>
                <input 
                    type="checkbox" 
                    checked={task.isDone} 
                    onChange={() => onToggle(task.id, task.isDone, task.title)}/>
                {task.title}
            </label>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    );
}