import { useEffect, useState } from "react";
import { useCategoryIndex } from "../hooks/useCategoryIndex";

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
    const {trie, addCategory} = useCategoryIndex();
    const [categoryInput, setCategoryInput] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [haveDate, setHaveDate] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        if(open){
            setCategoryInput('');
        }
    }, [open]);

    useEffect(() => {
        if (open) {
        onClose();
        }
    }, []);

    const suggestions = trie.search(categoryInput, 8);

    useEscClose(onClose);

    if(!open) return null;

    const ensureCategory = async (name: string) => {
        const id = trie.getId(name);
        if (id) return id;
        const created = await addCategory(name);
        return created.id;
    };

    const submit: React.FormEventHandler<HTMLFormElement> = async (e) =>{
        e.preventDefault();
        let formData = new FormData(e.currentTarget);

        const title = (formData.get("title") || "").toString().trim();
        if(!title) return;

        const description = (formData.get("description") || "").toString();
        const taskStartTime = formData.get("taskStartTime")?.toString();
        const taskFinishTime = formData.get("taskFinishTime")?.toString();
        const categoryId = await ensureCategory(categoryInput.trim() || 'Default');

        const body: any = { title, description, categoryId, isDone: false };
        if (taskStartTime && taskStartTime.trim() !== "") {
        body.taskStartTime = new Date(taskStartTime).toISOString();
        }
        if (taskFinishTime && taskFinishTime.trim() !== "") {
        body.taskFinishTime = new Date(taskFinishTime).toISOString();
        }

        try{
            var res = await fetch("/api/todos", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            if(!res.ok){
                const msg = await res.text();
                throw new Error(`POST/api/todos ${res.status} ${msg}`);
            }
        }
        catch(e){
            console.error(e)
        }
        finally{
            onCreated?.();
            setCategoryInput('');
            onClose();
        }
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
                            <input className="form-control mb-2" name="title" type="text" placeholder="what to do?"></input>
                            <input 
                                className="form-control mb-2" 
                                name="categoryId" 
                                type="text" 
                                placeholder="category" 
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                autoComplete="off"></input>
                            {isFocus && suggestions.length > 0 && (
                                <div className="list-group position-absolute w-100 shadow" style={{zIndex: 10}}>
                                    {suggestions.map(s => (
                                        <button
                                            type="button"
                                            key={s.id}
                                            className={`list-group-item list-group-item-action ${selectedId === s.id ? "active" : ""}`}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setCategoryInput(s.name);
                                                setSelectedId(s.id);
                                                setIsFocus(false);
                                            }}
                                            aria-selected={selectedId === s.id}
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={haveDate}
                                onChange={() => setHaveDate(!haveDate)}
                                id="haveDate"
                            />
                            <label className="form-check-label ms-2" htmlFor="haveDate">
                            Have date?
                            </label>
                            {haveDate && <div className="row">
                                <div className="col">
                                    <input type="date" className="form-control" name="taskStartTime"></input>
                                    <small className="form-text text-muted">Start time</small>
                                </div>
                                <div className="col">
                                    <input type="date" className="form-control" name="taskFinishTime"></input>
                                    <small className="form-text text-muted">Finish time</small>
                                </div>
                            </div>}
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