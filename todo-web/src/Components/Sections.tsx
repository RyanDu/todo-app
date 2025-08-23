import type {Todo} from "../App";
import { Card } from "./Card";

export function Sections({title, taskArray, onTaskChange, onDelete}
:{
    title: string;
    taskArray: Todo[];
    onTaskChange: (task: Todo, patch: Partial<Todo>)=>void;
    onDelete: (id: number) => void;
}){
    return (
        <div className="section glass-card h-100 w-100 p-4">
            {taskArray.length > 0?
                taskArray.map((task) => 
                    <Card 
                        key={task.id} 
                        task={task}
                        onTaskChange={onTaskChange}
                        onDelete={onDelete}/>
                )
            : <div className="text-secondary fs-6">
                You don't have {title} tasks.
              </div>}
        </div>
    );
}