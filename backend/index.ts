import cors from "cors";

//Import thư viện express để tạo server và API
import express from 'express';

//Import thư viện better-sqlite3 để làm việc với SQLite
import { Database } from "bun:sqlite";

//Import thư viện path để xử lí đường dẫn file cho an toàn
import path from 'path';

import fs from "fs";

// đọc file schema.sql
const schema = fs.readFileSync(
  path.join(__dirname, "db/schema.sql"),
  "utf-8"
);

//Khởi tạo ứng dụng Express
const app = express();

app.use(cors());
app.use(express.json());

//kết nối tới database SQLite (file app.db)
//_dirname: thư mục chứa file index.ts
// data/app.db: đường dẫn tới file database
const db = new Database(path.join(__dirname, 'data/app.db'));
db.run("PRAGMA foreign_keys = ON;");
db.exec(schema);

db.exec(`
INSERT OR IGNORE INTO users (id, email, passwordHash)
VALUES (1, 'admin@example.com', 'hashed_password_123')
`)

//TASKS API
//[GET] /tasks :Lấy toàn bộ danh sách task từ database
app.get('/tasks', (req, res) => {
    //thực thi câu lệnh SQL lấy tất cả bản ghi trong tasks
    //prepare(): chuẩn bị câu SQL
    //all(): lấy tất cả dòng dữ liệu
    const tasks = db.prepare('SELECT * FROM tasks').all();

    //trả dữ liệu tasks về cho client dưới dạng JSON
    res.json(tasks);
});

//[POST] /tasks :Thêm một task mới vào database
app.post('/tasks', (req, res) => {
    //lấy dữ liệu gửi lên từ body request
    const { title, userId } = req.body;

    //thêm kiểm tra đầu vào (validation) cơ bản
    if (!title || !userId) {
        return res.status(400).json({ error : "Tiêu đề và userId là bắt buộc"});
    }

    //chuẩn bị câu lệnh SQL INSERT
    //Dùng dấu ? để truyền tham số, tránh SQL Injection
    try {
    const stmt = db.prepare(
        'INSERT INTO tasks (title, userId) VALUES (?, ?)'
    );

    //thực thi câu lệnh SQL với dữ liệu truyền vào
    //run() sẽ thực hiện INSERT vào databasee
    const info = stmt.run(title, userId);

    //Trả kết quả về client
    //LastaInsertRowid: id của task vừa được thêm
    res.status(201).json({
        id: info.lastInsertRowid,
        title,
        userId,
        status: 'pending'
    });
 } catch (error) {
    res.status(400).json({ error: "Lỗi: userId không tồn tại hoặc dữ liệu không hợp lệ"});
 }
});

// [PUT] /tasks/:id
//cập nhật thông tin của một task theo id
app.put('/tasks/:id', (req, res) => {
    //lấy id của task từ URL
    const { id } = req.params;
    const { title, status } = req.body;

    //kiểm tra nếu không có dữ liệu để cập nhật
    if (!title && !status) {
        return res.status(400).json({ error: "Cần ít nhất title hoặc status để cập nhật" });
    }

    //chuẩn bị câu lệnh SQL UPDATE
    //updatedAt được cập nhật lại bằng thời gian hiện tại
    const stmt = db.prepare(
        'UPDATE tasks SET title = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    );

    //Thực thi câu lệnh UPDATE
    const info = stmt.run(title, status, id);

    //nếu ko có dòng nào được cập nhật -> task ko tồn tại
    if (info.changes === 0){
        return res.status(404).send("Task không tồn tại");
    }

    //trả thông báo cập nhật thành công
    res.json({ message: "Cập nhật thành công"});
});

// [DELETE] /tasks/:id
// xóa một task theo id
app.delete('/tasks/:id', (req, res) => {
    //Thực thi câu lệnh SQL DELETE theo id
    const info = db
        .prepare('DELETE FROM tasks WHERE id = ?')
        .run(req.params.id);

    //Nếu ko xóa được dòng nào -> task ko tồn tại
    if (info.changes === 0 ){
        return res.status(404).send("Task không tồn tại");
    }
    //trả về thông báo xóa thành công 
    res.json({ message: "Đã xóa task thành công "});
});

// Khởi động server Express
// Server sẽ chạy tại http://localhost:3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});




 