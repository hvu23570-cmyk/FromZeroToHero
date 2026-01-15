1. HASHING PASSWORD (BĂM MẬT KHẨU)

- Không lưu mật khẩu dưới dạng văn bản thuần túy (plain text.)
- Nếu database bị lộ -> hacker thấy hết -> phải dùng thuật toán băm (thường là bcrypt) -> biến password thành 1 chuỗi ko thể giải mã ngược lại

+ Hash: chạy một chiều (password -> hash)
+ Verify: khi login, ta lấy password người dùng nhập, băm thử lại rồi so sánh với chuỗi hash trong DB
+ Ví dụ: Mật khẩu: 123456
-> Lưu trong DB: $2b$10$Eixzao...(Hacker nhìn vào cũng không biết là 123456)

2. JWT (JSON Web Token)
- Sau khi login vào thành công, Server cấp cho Client một "tấm thẻ thông hành" gọi là JWT
+ Cấu trúc: Gồm 3 phần (Header.Payload.Signature), Payload thường chứa userId
+ Đặc điểm: server ko cần lưu token này. Chỉ cần nhìn vào chữ ký (Signature) là biết token có bị giả mạo hay không

3.Middleware & Protected Routes
- Middleware là một chốt kiểm soát đứng trước các API quan trọng. Nó kiểm tra xem Header của Request có gửi kèm Token hợp lệ không
- Protect Route: 
+ Token  đúng -> Middleware cho đi tiếp và đính kèm thông tin vào req.user
+Token sai/thiếu -> chặn lại và trả về lỗi 401 Unauthorized

4. Luồng hoạt động (VÍ DỤ)
- Bước 1: Đăng ký(Register)
+ User gửi { email: "abcd@gmail.com", pass: "123" } 
+ Server: Băm "123" thành "xyz_hash"
+ Server: Lưu vào DB {  email: "abcd@gmail.com", password: "xyz_hash" }.

- Bước 2: Đăng nhập(Login)
+ User gửi { email: "abcd@gmail.com", pass: "123" }
+ Server: Tìm user theo email, lấy "xyz_hash" ra so sánh
+ Server: Nếu khớp, tạo một Token(chứa userId:1) và trả về cho Client

- Bước 3: Lấy danh sách Task (Protected)
+ Client gửi: GET /tasks kèm Header Authorization: Bearer <token_vừa_nhận>
+ Middleware: Giải mã token -> lấy được userId: 1
-> Gắn req.user = { id: 1 }
-> Gọi next() để vào hàm xử lý chính 
+ Controller: Lấy userId từ req.user
-> DB.tasks.find({ ownerId:1 }) -> Chỉ trả về task của chính người đó

* LƯU Ý
- Secret Key: Chuỗi dùng để ký JWT phải cực kỳ bảo mật (để trong file .env )
- HTTP Status Code:
+ 201: tạo User thành công
+ 401: chưa đăng nhập hoặc Token hết hạn
+ 403: đã đăng nhập nhưng không có quyền vào (Forbidden)