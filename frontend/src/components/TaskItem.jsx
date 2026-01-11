function TaskItem({ task, onDelete}) {
    return (
        <li>
            {/* Hiển thị tiêu đề task */}
            {task.title}

            {/* Nút xóa task */}
            <button onClick={() => onDelete(task.id)}>xóa</button>
        </li>
    );
}
export default TaskItem;