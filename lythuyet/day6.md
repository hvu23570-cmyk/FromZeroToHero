1. React Router là gì ? (xương sống điều hướng )

- React Router dùng để :
+ Tạo nhiều trang trong SPA (Login /Register /Tasks)
+ URL thay đổi không reload trang

- Khái niệm cốt lõi :
+ <BrowserRouter> : Bọc toàn app
+ <Routes> : Chứa danh sách route 
+ <Route> : Map URL -> Component 
-> đây là quá trình thiết lập một "bản đồ" để trình duyệt biết cần phải hiển thị giao diện nào khi người dùng truy cập vào một địa chỉ cụ thể
+ useNavigate() : Chuyển trang bằng code

-Ví dụ: 
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/tasks" element={<TasksPage/>}/>
  <Routes>
</BrowserRouter>

2. useNavigate - chuyển sang sau submit
- Dùng khi:
+ Login xong -> qua /tasks
+ Register xong -> qua /logins

- Cách dùng:
const navigate = useNavigate();

navigate("/tasks");

- Ví dụ trong login:
function handleSubmit() {
    localStorage.setItem("token", "fake-token");
    navigate("/tasks");
}

3. apiClient là gì ?
- apiClient = chỗ duy nhất gọi API
-> sau này đổi BE/ thêm token/ handle lỗi chỉ sửa 1 chỗ

*Mục tiêu apiClient
- có baseURL
- có hàm request(path, options)
- tự gắn Authorization nếu có token 

4. apiClient skeleton ( QUAN TRỌNG NHẤT )
// srx/ services/ apiClient.js

const baseURL = "http://localhost:3000";

export async function request(path, options = {}) {
    const token = localStorage.getItem("token);

    const headers = {
        "Content-Type" : "applications/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
        //đính kèm token vào header theo chuẩn Bearer để server xác thực danh tính
    }

    const res = await fetch(baseURL + path,{
      ...options,
      headers,
});
returb res.json();
}

5. Gọi thử 1 GET

import { request } from ".../services/apiClient";
 
useEffect(() => {
    request("/tasks").then(data => {
        console.log(data);
    });
}; []);

6. Token + localStorage
- LOGIN xong : localStorage.setItem("token", "fake-token");

- LOGOUT : localStorage.removeItem("token");

- CHECK LOGIN : const token = localStorage.getItem("token");

7. Guard logic : chặn vào /tasks nếu chưa có login
- có token -> cho vào /tasks
- không có -> đá về /login

- Ví dụ  trong TasksPage :

const navigate = useNavigate();

useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navitage("/login");
    }
}, []);

8. FLOW chuẩn FE hôm nay

LoginPage
  ↓ submit
Lưu token vào localStorage
  ↓ navigate
TasksPage
  ↓ useEffect
Check token
  ↓
Gọi apiClient

- Giai đoạn       Tên gọi kỹ thuật    Trạng thái
+ Bấm nút         Event Handling      Lưu token
+ Đổi trang       Routing             Thay đổi Componet   
+ Vừa vào trang   Mounting            useEffect kích hoạt
+ Check Token     Authorization       Bảo vệ Route
+ Giao tiếp BE    API Fetching        Lấy dữ liệu

*GHI NHỚ NHANH
-Router = map URL → Page
- useNavigate = chuyển trang bằng code
- apiClient = gọi API tập trung
- Token = lưu localStorage
- Tasks = phải có token mới vào