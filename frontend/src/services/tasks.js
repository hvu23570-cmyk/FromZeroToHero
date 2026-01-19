const API_URL = "http://localhost:3000";

const getAuthHeader = () => {
    
    //lấy token từ LocalStorage
    const token = localStorage.getItem("token");
    return {
        //báo cho backend biết body là JSON
        "Content-type": "application/json",

        //gửi token theo chuẩn Bearer
        // Middlwware BE sẽ đọc header này để verify JWT
        "Authorization": `Bearer ${token}`,
    };
};

//lấy danh sách task
export const getTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`,{
        headers: getAuthHeader(),
    });
    //chuyển response sang JSON rồi trả về cho FE
    return res.json();
}

//tạo task mới
export const createTask = async (title) => {
    //gửi request POST
    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",

        //gắn token để backend biết được task thuộc user nào
        headers: getAuthHeader(),

        //body gửi lên backend
        body: JSON.stringify({
            title: title, //nội dung task
        }),
    });
    return res.json();
};

//cập nhật task 
export const updateTask = async (id, patch) => {
    //gửi request PATCH tới /tasks/:id
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(patch)
    });
    return res.json();
};

//xóa task
export const deleteTask = async (id) => {
    //gửi request delete
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
    });
    return res.json();
};