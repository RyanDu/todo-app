import { useEffect } from "react";

export function useEscClose(onClose: ()=>void){
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.key == "Escape"){
                onClose();
            }
        };
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    },[onClose])
}

function AddToDoModel({
    open,
    onClose,
    onCreated,
}:{
    open: boolean;
    onClose: ()=>void;
    onCreated: ()=>void;
}){
    useEscClose(onClose);

    if(!open) return null;

    const submit: React.FormEventHandler<HTMLFormElement> = async (e) =>{
        e.preventDefault();
        let formData = new FormData(e.currentTarget);

        const title = (formData.get("title") || "").toString().trim();
        if(!title) return;

        const description = (formData.get("description") || "").toString();
        const categoryId = formData.get("categoryId");
        const taskStartTime = formData.get("taskStartTime");
        const taskFinishTime = formData.get("taskFinishTime");

        var res = await fetch("/api/todos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, description, categoryId, taskStartTime, taskFinishTime, isDone:false})
        });

        if(!res.ok){
            const msg = await res.text();
            throw new Error(`POST/api/todos ${res.status} ${msg}`);
        }

        onCreated?.();
        onClose();
    }

    return(
        <div className="overlay" onClick={onClose}>
            <div className="modal" 
                onClick={(e) => e.stopPropagation()}>
                <h3>Add task</h3>
                <form onSubmit={submit}>
                    <input name="title" type="text" placeholder="what to do?"></input>
                    <input name="categoryId" type="number"></input>
                    <input name="taskStartTime"></input>
                    <input name="taskFinishTime"></input>
                    <textarea name="description" placeholder="Tell more details"></textarea>
                    <div className="actions">
                        <button type="button" onClick={onClose} className="btn cancel">Cancel</button>
                        <button type="submit" className="btn primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddToDoModel