import { useEffect, useState } from "react";
import type {Todo} from "../App";

export function Card({task, onToggle, onDelete} 
: {
    task: Todo;
    onToggle: (id: number, isDone: boolean, title: string)=>void;
    onDelete: (id: number) => void;
}){

    const [haveDate, setHaveDate] = useState(false);

    useEffect(() => {
        if(task.taskStartTime && task.taskFinishTime){
            setHaveDate(true);
        }
    },[])

    return(
        <div className="card">
            <h4>{task.title}</h4>
            <div className="d-flex justify-content-between align-items-center">
                <div className="form-check">
                    <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.isDone}
                    onChange={() => onToggle(task.id, task.isDone, task.title)}
                    id={`task-${task.id}`}
                    />
                    <label className="form-check-label ms-2" htmlFor={`task-${task.id}`}>
                    Completed
                    </label>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onDelete(task.id)}>
                    Delete
                </button>
            </div>
            <div className="row g-2">
                <div className="col">
                    <input
                    type="date"
                    className="form-control"
                    value={task.taskStartTime}
                    onChange={(e) => console.log("start", e.target.value)}
                    />
                    <small className="form-text text-muted">Start time</small>
                </div>
                <div className="col">
                    <input
                    type="date"
                    className="form-control"
                    value={task.taskFinishTime}
                    onChange={(e) => console.log("finish", e.target.value)}
                    />
                    <small className="form-text text-muted">Finish time</small>
                </div>
            </div>
            <textarea value={task.description} placeholder="description"></textarea>
        </div>
    );
}