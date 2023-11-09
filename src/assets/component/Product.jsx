import React, { useState, useEffect, useRef } from "react";

export default function Product() {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [editingTaskName, setEditingTaskName] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    // add
    const addTask = () => {
        if (taskName.trim()) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                completed: false,
            };
            setTasks([...tasks, newTask]);
            setTaskName("");
            inputRef.current.focus();
        } else {
            alert("Tên công việc không được để trống");
        }
    };

    // edit
    const openEditForm = (taskId, taskName) => {
        setEditingTaskId(taskId);
        setEditingTaskName(taskName);
        setIsEditFormVisible(true);
    };

    const closeEditForm = () => {
        setEditingTaskId(null);
        setEditingTaskName("");
        setIsEditFormVisible(false);
    };

    const editTask = () => {
        if (editingTaskName.trim()) {
            const updatedTasks = tasks.map((task) =>
                task.id === editingTaskId ? { ...task, name: editingTaskName } : task
            );
            setTasks(updatedTasks);
            closeEditForm();
        } else {
            alert("Tên công việc không được để trống");
        }
    };

    // delete
    const deleteTask = (taskId) => {
        const taskToDelete = tasks.find((task) => task.id === taskId);
    
        if (taskToDelete) {
            const shouldDelete = window.confirm(`Bạn có chắc muốn xóa công việc '${taskToDelete.name}' này?`);
            
            if (shouldDelete) {
                const updatedTasks = tasks.filter((task) => task.id !== taskId);
                setTasks(updatedTasks);
            }
        }
    };
    

    // complete
    const toggleTaskCompletion = (taskId) => {
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const completedTasksCount = tasks.filter((task) => task.completed).length;
    const taskCount = tasks.length;

    return (
        <div className="App">
            <div className="form">
                <h1>Danh sách công việc</h1>
                <form className="form-input">
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        ref={inputRef}
                        placeholder="Nhập tên công việc"
                    />
                    <button onClick={addTask}>Thêm</button>
                </form>
                {tasks.length === 0 ? (
                    <img id="no-tasks-image" src="https://t4.ftcdn.net/jpg/05/86/21/03/360_F_586210337_WOGOw0l7raEB8F61Muc4hWbvVcyQdk9Z.jpg" alt="No tasks" />
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                />
                                <span
                                    style={{ textDecoration: task.completed ? "line-through" : "none" }}
                                >
                                    {task.name}
                                </span>
                                <button onClick={() => openEditForm(task.id, task.name)}>
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => deleteTask(task.id)}>
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {editingTaskId && (
                    <div className={`edit-form ${isEditFormVisible ? "visible" : "hidden"}`}>
                        <div className="bg">
                            <h2>Cập nhật công việc</h2>
                            <form>
                                <div className="form-display">
                                    <label>Tên công việc</label>
                                    <input
                                        type="text"
                                        value={editingTaskName}
                                        onChange={(e) => setEditingTaskName(e.target.value)}
                                    />
                                    <div className="btn-group">
                                        <button onClick={() => editTask()}>Đồng ý</button>
                                        <button onClick={() => closeEditForm()}>Hủy</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="complete" style={{ display: tasks.length === 0 || completedTasksCount === taskCount ? "none" : "block" }}>
                    <p>Công việc đã hoàn thành: <span>{completedTasksCount}/{taskCount}</span></p>
                </div>

                <div className="allComplete" style={{ display: completedTasksCount === taskCount && tasks.length !== 0 ? "block" : "none" }}>
                    <p><i className="fa-solid fa-check"></i> Hoàn thành công việc</p>
                </div>
            </div>
        </div>
    );
}
