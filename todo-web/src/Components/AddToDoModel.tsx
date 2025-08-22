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
        const taskStartTime = formData.get("taskStartTime")?.toString();
        const taskFinishTime = formData.get("taskFinishTime")?.toString();

        const body: any = { title, description, categoryId, isDone: false };
        if (taskStartTime && taskStartTime.trim() !== "") {
        body.taskStartTime = new Date(taskStartTime).toISOString();
        }
        if (taskFinishTime && taskFinishTime.trim() !== "") {
        body.taskFinishTime = new Date(taskFinishTime).toISOString();
        }

        var res = await fetch("/api/todos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        if(!res.ok){
            const msg = await res.text();
            throw new Error(`POST/api/todos ${res.status} ${msg}`);
        }

        onCreated?.();
        onClose();
    }

    return(
        <div className="overlay modal fade show d-block" onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered"
                role="document" 
                onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add task</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={submit}>
                            <input className="form-control" name="title" type="text" placeholder="what to do?"></input>
                            <input className="form-control" name="categoryId" type="number"></input>
                            <input className="form-control" name="taskStartTime"></input>
                            <input className="form-control" name="taskFinishTime"></input>
                            <textarea className="form-control" name="description" placeholder="Tell more details"></textarea>
                            <div className="col-12 d-flex justify-content-end gap-2">
                                <button type="button" onClick={onClose} className="btn cancel">Cancel</button>
                                <button type="submit" className="btn primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddToDoModel