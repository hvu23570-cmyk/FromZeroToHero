1️⃣ Vite là gì?

Vite là công cụ tạo & chạy dự án FE rất nhanh

Dùng cho React / Vue / Vanilla JS

Có hot reload: sửa code → web tự cập nhật

Lệnh cơ bản:

bun create vite . --template react
bun install
bun run dev

2️⃣ Cấu trúc FE tối thiểu
src/
 ├─ pages/        // các trang (TasksPage, LoginPage…)
 ├─ components/   // component nhỏ tái sử dụng
 ├─ services/     // gọi API (chưa dùng hôm nay)
 ├─ App.jsx       // component gốc
 ├─ main.jsx      // điểm mount React


📌 Quy ước:

Page: chứa logic chính

Component: chỉ hiển thị + nhận props

3️⃣ Component trong React

Component = hàm trả về JSX

Tên component viết hoa chữ cái đầu

function TasksPage() {
  return <h2>Tasks</h2>;
}
export default TasksPage;

4️⃣ JSX là gì?

JSX = HTML viết trong JavaScript

Dùng {} để nhúng JS

<h2>{task.title}</h2>


Chú thích trong JSX:

{/* đây là comment */}

5️⃣ useState – kiến thức QUAN TRỌNG NHẤT hôm nay
const [tasks, setTasks] = useState([]);


tasks → state hiện tại

setTasks → hàm cập nhật state

KHÔNG được sửa trực tiếp state

❌ Sai:

tasks.push(newTask);


✅ Đúng:

setTasks([...tasks, newTask]);

6️⃣ Thêm item vào list (Add task)
const handleAddTask = () => {
  if (newTask.trim() === "") return;

  setTasks([
    ...tasks,
    { id: Date.now(), title: newTask }
  ]);

  setNewTask("");
};


📌 Nguyên tắc:

Luôn tạo mảng mới

React chỉ re-render khi state đổi reference

7️⃣ Xóa item khỏi list
const handleDeleteTask = (id) => {
  setTasks(tasks.filter(task => task.id !== id));
};


filter → tạo mảng mới

Giữ lại các task khác id cần xóa

8️⃣ Render danh sách bằng map
{tasks.map(task => (
  <li key={task.id}>{task.title}</li>
))}

key là gì?

Giúp React phân biệt từng item

BẮT BUỘC khi render list

Nên dùng id, không dùng index

9️⃣ Props – truyền dữ liệu giữa component
Component cha:
<TaskItem
  key={task.id}
  task={task}
  onDelete={handleDeleteTask}
/>

Component con:
function TaskItem({ task, onDelete }) {
  return (
    <li>
      {task.title}
      <button onClick={() => onDelete(task.id)}>xóa</button>
    </li>
  );
}


📌 Props:

Chỉ đọc, không được sửa

Dùng để tách UI cho gọn

🔟 Tách component (best practice)

Page → quản lý state

Component → hiển thị

📂 Vì sao TaskItem nằm trong components/?

Có thể tái sử dụng

Không phụ thuộc page cụ thể

Giữ code sạch & dễ bảo trì

