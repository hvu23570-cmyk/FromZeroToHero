-- Tạo bảng tasks nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS tasks(

    --id: khóa chính, số nguyên tự động tăng
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    --userId: id của user sở hữu task này ko được để trống NOT NULL
    userId INTEGER NOT NULL,

    --title: tiêu đề không được để trống not null
    title TEXT NOT NULL,

    --status: trạng thái công việc mặc định là đang chờ
    status TEXT DEFAULT 'pending',

    --createdAt: thời điểm tạo task tự động lấy thời gian default hiện tại
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    --updatedAt: thời điểm cập nhật task lần cuối
    --backend sẽ cập nhật lại khi sửa task
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    --Khóa ngoại: userId phải tồn tại trong users.id
    --đảm bảo task luôn thuộc về user hợp lệ
    FOREIGN KEY (userId) REFERENCES users(id)
);