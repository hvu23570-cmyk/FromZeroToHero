# Base URL: http://localhost:3000
# Auth header: Authorization: Bearer <token>

1. Register (Đăng ký)
- Method: POST
- Path: /auth/register
- Request: json{ "email": "hvu23570@gmail.com", "password": "123" }
- Response 201: json{ "id": 1, "email": "hvu23570@mail.com" } //tạo thành công 1 tài nguyên mới
- Error 400: json{ "error": { "code": "VALIDATION_ERROR", "message": "Email đã tồn tại" } }

2. Login (Đăng nhập)
- Method: POST
- Path: /auth/login
- Request: json{ "email": "hvu23570@gmail.com", "password": "123" }
- Response 200: json{ "id":1, "message": "login thành công" }
- Error 401: json{ "error": { "code": "AUTH_FAILED", "message": "Sai email hoặc mật khẩu" } }

3. Get All Tasks (Lấy danh sách task)
- Method: GET
- Path: /tasks
- Response 200: json [{ "id":1, "title": "Học Git", "status": "pending" }]

4. Create Task (Tạo task mới)
- Method: POST
- Path: /tasks
- Request: json{ "title": "Làm bài tập API" }
- Response 201: json [{ "id":2, "title": "Làm bài tập API", "status": "pending"}]
- Error 400: json{ "error": { "code": "VALIDATION_ERROR", "message": "Tiêu đề không được để trống" } }

5. Update Task (Cập nhật trạng thái)
- Method: PATCH
- Path: /tasks/:id
- Request: json{ "status": "completed" }
- Response 200: json{ "id":2, "status": "completed"}
- Error 404: json{ "error" : {"code" : "NOT_FOUND", "message": "không tìm thấy task" } }

6. Delete Task (Xóa task)
- Method: DELETE
- Path: /tasks/:id
- Request: none
- Response 404: json{ "error" : {"code" : "NOT_FOUND", "message": "không tìm thấy task } }
