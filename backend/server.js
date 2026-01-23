// Hàm trả về JSON chuẩn
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

// Hàm trả về lỗi theo format
function jsonError(message, code = "ERROR", status = 400, headers = {}){
  return json({
    error: {
      code,
      message
    }
  }, status, headers);
}

import { db } from "./src/db.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET chưa được set trong file .env");
}

try {
  const result = db.query("SELECT 1").get();
  console.log("DB kết nối thành công", result);
} catch (e) {
  console.log("DB lỗi", e);
}

//dữ liệu mẫu
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    //Headers CORS cho phép Frontend từ cổng 5173 gọi vào
    const corsHeaders = {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    try {
      const url = new URL(req.url);
      const method = req.method;

      //Xử ký Preflight request
      if (method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
      }

      //1. AUTH: REGISTER
      if (url.pathname === "/auth/register" && method === "POST") {
        try {
          const { email, password } = await req.json();
          //VALIDATE INPUT
          if (!email || !password) return jsonError("Email và mật khẩu không được để trống", "VALIDATION_ERROR", 400, corsHeaders);
          if (!email.includes("@")) return jsonError("Email không hợp lệ", "VALIDATION_ERROR", 400, corsHeaders);
          if (password.length < 6) return jsonError("Mật khẩu phải có ít nhất 6 ký tự", "VALIDATION_ERROR", 400, corsHeaders);

          //SAU KHI QUA CÁC CỬA KIỂM TRA MỚI BẮT ĐẦU HASH
          const passwordHash = await Bun.password.hash(password);
          db.prepare(
            "INSERT INTO users (email, passwordHash) VALUES (?, ?)",
          ).run(email, passwordHash);
          return json({ message: "Đăng ký thành công" }, 201, corsHeaders);
        } catch (e) {
          if (e.message.includes("UNIQUE")) {
            return jsonError("Email đã tồn tại", "AUTH_ERROR", 400, corsHeaders);
          }
          return jsonError("Lỗi hệ thống", "SERVER_ERROR", 500, corsHeaders);
        }
      }

      //2.  AUTH: LOGIN (cập nhật Format lỗi)
      if (url.pathname === "/auth/login" && method === "POST") {
        try {
        const { email, password } = await req.json();
        if (!email || !password) {
        return jsonError("Email và mật khẩu không được để trống", "VALIDATION_ERROR", 400, corsHeaders);
        }
        //tìm user theo email
        const user = db.query("SELECT * FROM users WHERE email = ?").get(email);

        //Kiểm tra user tồn tại và verify mật khẩu hash
        if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
          return jsonError("Email hoặc mật khẩu không đúng", "AUTH_ERROR", 401, corsHeaders);
        }
        
        // Tạo token trả về cho Frontend
          const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
          );
          return json({ token }, 200, corsHeaders);
        } catch (e) {
          return jsonError("Đăng nhập thất bại", "AUTH_ERROR", 400, corsHeaders);
        }
      }

      //3. MIDDLEWARE CHECK TOKEN (cho các route/ tasks)
      let currentUser = null;
      if (url.pathname.startsWith("/tasks")) {
        const authHeader = req.headers.get("Authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) return jsonError("Bạn cần đăng nhập", "UNAUTHORIZED", 401, corsHeaders);

        try {
          currentUser = jwt.verify(token, JWT_SECRET);
        } catch (e) {
          return jsonError("Phiên đăng nhập hết hạn hoặc không hợp lệ", "UNAUTHORIZED", 401, corsHeaders);
        }
      }

      //4.ROUTE TASKS (đã được bảo vệ)
      if (url.pathname === "/tasks" && method === "GET") {
        const userTasks = db
          .query("SELECT * FROM tasks WHERE userId = ?")
          .all(currentUser.userId);
        return json(userTasks, 200, corsHeaders);
      }
      
      //POST /TASK TITLE TRỐNG -> 400
      if (url.pathname === "/tasks" && method === "POST") {
        const body = await req.json();
        // Edge case: title rỗng
        if ( !body.title || body.title.trim() === "" ){ //trim  loại bỏ kí tự khoảng trắng (dấu cách - tab-xuống dòng)
          return jsonError("Tiêu đề không được để rỗng", "VALIDATION_ERROR", 400, corsHeaders);   
        }
        const result = db
          .prepare("INSERT INTO tasks (userId, title) VALUES(?, ?) RETURNING *")
          .get(currentUser.userId, body.title);
        return json(result, 201, corsHeaders);
      }

      //SỬA TASK (PATCH)
      //PUT/ DELETE ID KHÔNG TỒN TẠI -> 404
      if ((method === "PATCH" || method === "PUT" || method === "DELETE") && url.pathname.startsWith("/tasks/")) {
        const id = url.pathname.split("/").pop();

        // Bước quan trọng nhất: Kiểm tra quyền sở hữu trước khi cho phép can thiệp
        const task = db.query("SELECT id FROM tasks WHERE id = ? AND userId = ?").get(id, currentUser.userId);
        if (!task) return jsonError("Không tìm thấy công việc hoặc bạn không có quyền", "NOT_FOUND", 404, corsHeaders);

        // Nhánh xử lý Cập nhật
        if (method === "PATCH" || method === "PUT") {
          const body = await req.json();
          if (!body.title || body.title.trim() === "") {
            return jsonError("Tiêu đề không được để trống", "VALIDATION_ERROR", 400, corsHeaders);
          }
          db.prepare( "UPDATE tasks SET title = ? WHERE id = ? AND userId = ?" ).run(body.title, id, currentUser.userId);
          return json({ message: "Cập nhật thành công" }, 200, corsHeaders);
        }

        // Nhánh xử lý Xóa
        if (method === "DELETE") {
          db.prepare("DELETE FROM tasks WHERE id = ? AND userId = ?").run(id, currentUser.userId);
          return json({ message: "Đã xóa thành công" }, 200, corsHeaders);
        }
      }

      //KIỂM TRA SỨC KHỎE HỆ THỐNG
      if (url.pathname === "/health" && method === "GET") {
        return json({ ok: true }, 200, corsHeaders);
      }

    return jsonError("Đường dẫn không tồn tại", "NOT_FOUND", 404, corsHeaders);
    } catch (err) {
      console.error("SERVER ERROR:", err);
      return jsonError("Lỗi máy chủ không xác định", "SERVER_ERROR", 500, corsHeaders);
    }
  },
});
console.log("Backend đang chạy tại http://localhost:3000");
