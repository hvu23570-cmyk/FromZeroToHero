1. Database(Cơ sở dữ liệu) là gì ?
- Là một hệ quản trị cơ sở dữ liệu nhẹ, không cần server,hoạt động như một thư viện phần mềm, lưu trữ toàn bộ database vào 1 file duy nhất
- Dữ liệu được ghi đè xuống ổ cứng (file.db) Sevrer có tắt thì dữ liệu vẫn nằm đó 
- SQLite là hệ quản trị cơ sở dữ liệu nhẹ nhất:
+ File-based: toàn bộ DB chỉ là 1 file (vd: app.db) dễ dàng copy, di chuyển
+ Severless: không cần cài đặt Service chạy ngầm như MySQL, Postgres
+ SQL Standard: sử dụng ngôn ngữ SQL tiêu chuẩn, học 1 lần dùng cho mọi DB khác

2. Ngôn Ngữ SQL (Structured Querry Language)
- Để làm CRUD với DB, bạn phải dùng 4 câu lệnh SQL
- CRUD = Create – Read – Update – Delete
+ CREATE: INSERT INTO table_name... : Thêm một dòng mới vào bảng
+ READ: SELECT * FROM table_name : Lấy dữ liệu từ bảng ra
+ UPDATE: UPDATE table_name SET... WHERE id = ? : Sửa dữ liệu của 1 dòng cụ thể
+ DELETE FROM table_name WHERE id = ? : Xóa dữ liệu của một dòng

3. Schema & Migrations (Thiết kế cấu trúc)
- Schema = bản thiết kế (cấu trúc) của database
- Nó mô tả 
+ Có bảng nào
+ Mỗi bảng có cột gì
+ Kiểu dữ liệu ( INT, VARCHAR, DATE,....)
+ Quan hệ giữa các bảng (FK)
- Ví dụ schema bảng users
  users
id (INT, PRIMARY KEY)
name (VARCHAR)
email (VARCHAR)
password (VARCHAR)
created_at (DATETIME)

- Migration = lịch sử các lần thay đổi các schema theo thời gian

- Trước khi lưu dữ liệu, bạn phải xây dựng khung nhà 
+ Table (Bảng) : giống như 1 file Excel (ví dụ bảng users, bảng tasks)
+ Column (Cột) : Định nghĩa kiểu dữ liệu (ID là số, Email là chữ, CreatedAt là thời gian)
+ Primary Key (Khóa chính): Một cột (thường là id) để phân biệt các dòng với nhau, ko bao giờ trùng lặp
+ Foreign Key (Khóa ngoại): Cột liên kết giữa 2 bảng. Cột userId trong bảng tasks chính là khóa ngoại để biết task đó thuộc về user nào

4. Cơ chế kết nối (Driver & Connection)
- Trong Node,js, code JS ko tự nói chuyện trực tiếp với file DB, nó cần một DRIVER -> phiên dịch trung gian
- DRIVER = thư viện giúp Node.js
+ Mở kết nối tới DB
+ Gửi câu lệnh SQL
+ Nhận kết quả trả về

- DRIVER trong Node.js
+ SQLite: sqlite3, better-sqlite3
+ MySQL: mysql2
+ PostgreSQL: pg
+ VD:
const sqlite3 = require("sqlite3");
-> ko có driver -> JS ko biết gửi SQL kiểu gì

* Connection (kết nối) là đường dây nối Node.js <-> Database
- Mỗi lần query SQL là dùng đường dây này 
- VD:
const db = new sqlite3.Database("database.db");
-> ở SQLite: kết nối tới file.db
-> ở MySQL/Postgres: kết nối tới server DB

* Connection Pool là tập hợp nhiều kết nối sẵn có 
+ ko phải mỗi request lại mở kết nối mới
+ dùng xong -> trả lại pool
+ nhanh + tiết kiệm tài nguyên

* Placeholders (?): chỗ trống trong câu SQL, nơi dữ liệu sẽ được truyền vào sau, chứ không viết trực tiếp trong câu SQL

- Cách Sai: const sql = "SELECT * FROM users WHERE email = '" + email + "'";
- Nếu người dùng nhập:
email: ' OR 1=1-- 
-> SQL thành: SELECT * FROM users WHERE email = '' OR 1=1 --
-> lấy toàn bộ users

- Cách Đúng - dùng Placeholders (?) : const sql = "SELECT * FROM users WHERE email = ?";

- VÍ DỤ "Trước và Sau"
+ Ngày 7 (dùng array):
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id);
    res.send("Deletd");
});

+ Ngày 8 (dùng DB):
app.delete('/tasks/:id', (req, res) => {
const { id } = req.params;
//gửi lệnh xuống db xóa thật sự trong file
db.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send("Deleted from DB");
});
});