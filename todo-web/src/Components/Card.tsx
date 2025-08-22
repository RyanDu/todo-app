import type {Todo} from "../App";

export function Card({task} : {task: Todo}){
    return(
        <div className="card">
            <h4>{task.title}</h4>
            <p>Status: {task.isDone? "Done" : "In progress"}</p>
        </div>
    );
}