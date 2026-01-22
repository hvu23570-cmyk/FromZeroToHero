import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import { getTasks, createTask, deleteTask, updateTask } from "../services/tasks";

function TasksPage() {
  const [loading, setLoading ] = useState(false); 
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null); //null = ko có task nào đang xóa
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

// null = không có task nào đang xóa

  const [tasks, setTasks] = useState([]);
  //tasks: danh sách task hiện tại
  //setTasks: hàm để cập nhật danh sách task
  //useState([]): ban đầu danh sách task rỗng

  const [newTasks, setNewTasks] = useState("");
  //newTasks: nội dung đang nhập trong ô input
  //setNewTasks: hàm để cập nhật nội dung khi gõ
  //useState(""): ban đầu nội dung rỗng

//LOGOUT
const handleLogout = () => {
  localStorage.removeItem("token"); // Xóa token
  window.location.href = "/"; // Quay về trang Login
};

//TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
      setLoading(true); //bắt đầu load
        const data = await getTasks(); //gọi BE thật
        setTasks(data);
      } catch (err) {
        console.error("Load tasks failed", err);
        setError("Không tải được danh sách task");
      } finally {
      setLoading(false); //kết thúc load
      }
    };

    fetchTasks();
  }, []);
   
//CREATE
  const handleAddTask = async () => {
    //Khi người dùng bấm nút "Add Task"
    if (newTasks.trim() === "") return;

    try {
      setCreating(true);
      const createdTask = await createTask(newTasks); 

    setTasks([...tasks, createdTask]);
    setNewTasks("");
  } catch (err) {
    console.error("Create task failed", err);
    setError("Tạo task không thành công")
  }finally{
    setCreating(false);
  }
};
 
//DELETE
  const handleDeleteTask = async (id) => {
    try {
      setDeletingId(id); //đánh dấu task đang xóa
      await deleteTask(id); //gọi BE DELETE thật
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete task failed", err);
      setError("Không thể xóa Task")
    } finally{ //finally để dù lỗi hay không cũng reset loading
      setDeletingId(null) //xóa xong -> reset
    }
  };

//UPDATE
    const handleUpdateTask = async (id, patch) => {
      try {
        setUpdatingId(id);
         await updateTask(id, patch);
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, ...patch } : task      
        )
      );
    } catch (err) {
      console.error("Update task failed", err);
      setError("Cập nhật thất bại")
    } finally{
      setUpdatingId(null) //update xong -> reset
    }
  }; 

  return (
    <div style={{ padding: "20px" }}>
      {/* Tiêu đề trang đi kèm nút đăng xuất */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2> Tasks</h2>
        <button onClick={handleLogout} style={{ backgroundColor: "#ff4444", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer"}}>
          Logout
        </button>
    </div>
     
    {/* Hiển thị error */}
    {error && 
    ( <p style={{ color: "red", marginBottom: "20px" }}> {error} </p>
)}
      {/* Ô nhập nội dung task mới */}
      <input
        placeholder="Nhập task..."
        value={newTasks}
        onChange={(e) => setNewTasks(e.target.value)}
      />

      {/* Nút thêm task */}
      <button onClick={handleAddTask} disabled={creating}>
        {creating ? "Đang thêm...": "Add"}
      </button>

       {loading && <p>Đang tải tasks...</p>}

      {/* Danh sách task */}
      <ul>
        {/*map để render từng task */}
        {tasks.map((task) => (
          <TaskItem 
          key={task.id} 
          task={task} 
          onDelete={handleDeleteTask} 
          onUpdate={handleUpdateTask}  
          deleting={deletingId === task.id}
          updating={updatingId === task.id}
           />
        ))}

      </ul>
    </div>
  );
}
export default TasksPage; //Export component để sử dụng ở nơi khác
