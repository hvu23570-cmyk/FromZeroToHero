1. Error format thống nhất là gì ?
- Backend không được trả lỗi lung tung
- Luôn trả cùng 1 format
{
    "error": {
        "code": "SOME_ERROR_CODE",
        "message": "Mô tả lỗi cho người dùng"
    }
}
-> FE chỉ cần đọc error.message
-> Không cần đoán cấu trúc response
-> App không crash khi lỗi
-> FE không cần biết lỗi chi tiết chỉ cần message rõ ràng

2. Validation là gì ?
- Validation = kiểm tra dữ liệu đầu vào trước khi xử lý
+  Ví dụ: title có rỗng không ? id có tồn tại không ? token có hợp lệ không
-> không validate -> bug, crash, db lỗi
-> validate -> lỗi rõ, app ổn định

3. HTTP Status Code phải đúng nghĩa
- Dữ liệu gửi sai -> 400 Bad Request
- Không đăng nhập/token sai -> 401 Unauthorized
- Không tìm thấy resource -> 404 Not Found
- Server lỗi -> 500 Internal Server Error

4. Edge Case là gì ?
- Edge Case = trường hợp ít xảy ra nhưng chắc chắn sẽ xảy ra
+ User gửi title rỗng
+ FE gọi DELETE với id đã bị xóa
+ Token hết hạn nhưng FE vẫn gọi API

5. Backend - ví dụ xử lý từng lỗi

* Task title rỗng -> 400
if (!title || title.trim() === "") {
    return res.status(400).json({
        error: {
            code: "Task title không được để trống"
        }
    });
}

* Task không tồn tại -> 404
const task = db.getTaskById(id);

if (!task) {
    return res.status(404).json({
        error: {
            code: "TASK_NOT_FOUND",
            message: "Task không tồn tại"
        }
    });
}

* Token sai/ hết hạn -> 401(middleware)
if (!token) {
    return res.statuss(401).json({
        error: {
            code: "AUTH_TOKEN_MISSING",
            message: "Vui lòng đăng nhập"
        }
    });
}

6. Frontend hiển thị lỗi đúng cách
- SAI (demo) : alert("Something went wrong");
- ĐÚNG (app thật) :

try{
    await createTask(title);
} catch (err) {
    alert(err.error.message);
} 

hoặc setError(err.error.message);