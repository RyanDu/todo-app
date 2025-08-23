import { useEffect, useState } from "react";
import type {Todo} from "../App";

export function Card({task, onTaskChange, onDelete} 
: {
    task: Todo;
    onTaskChange: (task: Todo, patch: Partial<Todo>)=>void;
    onDelete: (id: number) => void;
}){

    const [haveDate, setHaveDate] = useState(false);
    const [desc, setDesc] = useState(task.description);

    useEffect(() => {
        if(task.taskStartTime && task.taskFinishTime){
            setHaveDate(true);
        }
    },[])

    return(
        <div className="card mb-2">
            <h4>{task.title}</h4>
            <div className="d-flex justify-content-between align-items-center pb-2">
                <div className="form-check">
                    <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.isDone}
                    onChange={() => onTaskChange(task, { isDone: !task.isDone })}
                    id={`task-${task.id}`}
                    />
                    <label className="form-check-label ms-2" htmlFor={`task-${task.id}`}>
                    Completed
                    </label>
                </div>
                <div className="form-check">
                    <input
                    type="checkbox"
                    className="form-check-input"
                    checked={haveDate}
                    onChange={() => setHaveDate(!haveDate)}
                    id={`task-${task.id}`}
                    />
                    <label className="form-check-label ms-2" htmlFor={`task-${task.id}`}>
                    Have date?
                    </label>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onDelete(task.id)}>
                    Delete
                </button>
            </div>
            {haveDate && <div className="row g-2">
                <div className="col">
                    <input
                    type="date"
                    className="form-control"
                    value={task.taskStartTime}
                    onChange={(e) => onTaskChange(task, {taskStartTime: e.target.value})}
                    />
                    <small className="form-text text-muted">Start time</small>
                </div>
                <div className="col">
                    <input
                    type="date"
                    className="form-control"
                    value={task.taskFinishTime}
                    onChange={(e) => onTaskChange(task, {taskFinishTime: e.target.value})}
                    />
                    <small className="form-text text-muted">Finish time</small>
                </div>
            </div>}
            <textarea value={task.description} placeholder="description"
                onChange={(e) => setDesc(e.target.value)} 
                onBlur={() => onTaskChange(task, {description: desc})}></textarea>
        </div>
    );
}