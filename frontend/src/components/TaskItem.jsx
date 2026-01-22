import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate, deleting, updating }) {
  //kiểm soát trạng thái đang sửa
  const [isEditing, setIsEditing] = useState(false);

  //lưu title đang sửa
  const [title, setTitle] = useState("");

   //bắt đầu sửa
  const handleEdit = () => {
    setTitle(task.title); //copy title khi bắt đầu edit
    setIsEditing(true);
  };


  //khi bấm nút lưu
  const handleSave = () => {
    if (title.trim() === "") return;
    //gọi hàm update
    onUpdate(task.id, { title });
    //thoát chế độ edit
    setIsEditing(false);
  };

  //EDIT
  if (isEditing) {
    //trường hợp: đang sửa
    return (
      <li>
        <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={updating}/>

        <button onClick={handleSave} disabled={updating}> {updating ? "Đang lưu...": "Lưu"}</button>

        <button onClick={() => setIsEditing(false)}disabled={updating}>hủy</button>
      </li>
    );
  }

  //trường hợp: không sửa (mặc định)
  return (
    <li>
      <span>{task.title}</span>
      <button onClick = {handleEdit} disabled={deleting} >sửa</button>
      <button onClick={() => onDelete(task.id)} disabled={deleting}>{deleting ? "Đang xóa...": "xóa"}</button>
    </li>
  );
}
export default TaskItem;
