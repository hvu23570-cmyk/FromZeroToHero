1. Luồng đi của dữ liệu (End-to-End Flow)

- User bấm -> Frontend xử lý -> Backend xử lý -> Database -> Backend trả kết quả -> Frontend hiển thị

- Khi kết nối FE và BE, chúng ta cần tuân theo quy trình "Yêu cầu - Phản hồi" :
1. FE: Gửi HTTP Request (kèm dữ liệu/token)
2. BE: Kiểm tra xác thực, xử lý Logic, truy vấn Database
3. BE: Trả về HTTP Response (Status code & JSON)
4. FE: Cập nhật State và hiển thị giao diện

2. Quản lý Authentication (Token-based)
- Đây là "chìa khóa" để bảo mật ứng dụng
+ Login: BE trả về một đoạn mã (JWT - JSON Web Token)
+ Storage: FE lưu token vào localStorage để không phải đăng nhập lại khi F5
+ Authorization Header: Mọi request sau đó phải gửi kèm token để BE biết bạn là ai

- Ví dụ Implement services/auth.js:

// Địa chỉ gốc của Backend API
// Tất cả request sau này sẽ dựa trên URL này
const API_URL = 'http://localhost:5000/api';

// Hàm login: Nhận email và password từ FE
// async: cho phép dùng await bên trong hàm 
export const login = async (email, password) => {

// Gửi HTTP request tới BE: POST /api/login
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST', //Phương thức POST gửi dữ liệu lên server

        //Header cho biết BE gửi dữ liệu đi là JSON
        headers: { 'Content-Type': 'application/json' },
    });
    
    //chuyển response từ BE (JSON) -> object JS
    const data = await response.json();

    //nếu BE trả về token -> login thành công
    if (data.token) {
        localStorage.setItem('token', data.token); //lưu chìa khóa
    }
    return data;
};

-> Tóm tắt luồng End-to-End
1. User nhập email + password -> bấm login
2. FE gọi login(email, password)
3. FE gửi POST /api/login lên BE
4. BE xác thực -> tạo JWT token
5. BE trả JSON { token: "..." }
6. FE lưu token vào localStorage
7. FE dùng token cho các API protected sau

3. Thao với Tasks (CRUD)
- Khi gọi API cho Tasks, quan trọng nhất là phải đính kèm Token trong Header
- Ví dụ: services/tasks.js:

//Hàm getHeaders dùng để tạo headers chỏ các request cần đăng nhập
const getHeaders = () => ({
    
    //Cho backend biết dữ liệu gửi/nhận là JSON
    'Content-Type': 'application/json',
     
     // Authorization header
     // Gửi token lên BE theo chuẩn: Bearer <token>
     // Token được lấy từ LocalStorage
    'Authorization': `Bearer ${localStorage.getItem('token')}` //gửi chìa khóa đi
})

export const getTasks = async () => {

    //gửi request GET/ tasks kèm headers (có token)
    const res = await fetch(`${API_URL}/tasks`, {headers: getHeaders() 
    });

    //chuyển response JSON từ BE -> object JS
    return res.json();
};

//Hàm tạo task mới 
export const createTask = async (title) => {

    //gửi request POST /tasks
    return fetch(`${API_URL}/tasks`,{
        method: 'POST', //phương thức post tạo dữ liệu mới

        //Headers có Content-Type + Authorization
        headers: getHeaders(), 

        body: JSON.stringify({ title })
    });
};