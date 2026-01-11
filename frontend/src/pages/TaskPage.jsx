import { useState } from "react";
import TaskItem from "../components/TaskItem";
function TasksPage() {
  const [tasks, setTasks] = useState([]);
  //tasks: danh sách task hiện tại
  //setTasks: hàm để cập nhật danh sách task
  //useState([]): ban đầu danh sách task rỗng

  const [newTasks, setNewTasks] = useState("");
  //newTasks: nội dung đang nhập trong ô input
  //setNewTasks: hàm để cập nhật nội dung khi gõ
  //useState(""): ban đầu nội dung rỗng

  const handleAddTask = () => {
    //Khi người dùng bấm nút "Add Task"
    if (newTasks.trim() === "") return;
    //Nếu nội dung rỗng thì không làm gì cả

    setTasks([
      ...tasks,
      {
        //copy toàn bộ task cũ
        id: Date.now(), //tạo id = thời gian hiện tại
        title: newTasks,
      },
    ]);

    setNewTasks("");
  };

  const handleDeleteTask = (id) => {
    //xóa task theo id

    setTasks(tasks.filter((task) => task.id !== id));
  }; //filter tạo mảng mới và giữ lại cái task id khác với id truyền vào
  return (
    <div style={{ padding: "20px" }}>
      {/* Tiêu đề trang */}
      <h2> Tasks</h2>

      {/* Ô nhập nội dung task mới */}
      <input
        placeholder="Nhập task..."
        value={newTasks}
        onChange={(e) => setNewTasks(e.target.value)}
      />

      {/* Nút thêm task */}
      <button onClick={handleAddTask}>add</button>

      {/* Danh sách task */}
      <ul>
        {/*map để render từng task */}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={handleDeleteTask} />
        ))}
      </ul>
    </div>
  );
}
export default TasksPage; //Export component để sử dụng ở nơi khác
