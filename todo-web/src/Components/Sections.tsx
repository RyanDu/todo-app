import type {Todo} from "../App";
import { Card } from "./Card";

export function Sections({title, taskArray, onToggle, onDelete}
:{
    title: string;
    taskArray: Todo[];
    onToggle: (id: number, isDone: boolean, title: string)=>void;
    onDelete: (id: number) => void;
}){
    return (
        <div className="section">
            {taskArray.length > 0?
                taskArray.map((task) => 
                    <Card 
                        key={task.id} 
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}/>
                )
            : <p>You don't have {title} tasks.</p>}
        </div>
    );
}