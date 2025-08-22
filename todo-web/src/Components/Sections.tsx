import type {Todo} from "../App";
import { Card } from "./Card";

export function Sections({title, taskArray}
:{
    title: string;
    taskArray: Todo[];
}){
    return (
        <div className="section">
            {taskArray.length > 0?
                taskArray.map((task) => <Card key={task.id} task={task}/>)
            : <p>You don't have {title} tasks.</p>}
        </div>
    );
}