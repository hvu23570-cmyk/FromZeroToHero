import { db } from "./db.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET chưa được set trong file .env");
}


try{
const result = db.query("SELECT 1").get();
console.log("DB kết nối thành công", result);
} catch (e){
  console.log("DB lỗi", e);
}

//dữ liệu mẫu 
const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const method = req.method;

        //Headers CORS cho phép Frontend từ cổng 5173 gọi vào
        const corsHeaders = {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        //Xử ký Preflight request
        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        //1. AUTH: REGISTER
        if (url.pathname === "/auth/register" && method === "POST") {
            try {
            const { email, password } = await req.json();
            //VALIDATE INPUT 
            //KIỂM TRA XEM CÓ TRỐNG KHÔNG
            if (!email || !password){
                return Response.json({ error: "Email và mật khẩu không được để trống"}, { status: 400, headers: corsHeaders});
            }
            
            //KIỂM TRA ĐỊNH DẠNG EMAIL CƠ BẢN
            if (!email.includes("@")) {
                return Response.json({error: "Email không hợp lệ"}, {status: 400, headers: corsHeaders});
            }

            //KIỂM TRA ĐỘ DÀI MẬT KHẨU
            if (password.length < 6) {
                return Response.json({error: "Mật khẩu phải có ít nhất 6 ký tự"}, {status: 400, headers: corsHeaders});
            }
            
            //SAU KHI QUA CÁC CỬA KIỂM TRA MỚI BẮT ĐẦU HASH
            const passwordHash = await Bun.password.hash(password);
            db.prepare("INSERT INTO users (email, passwordHash) VALUES (?, ?)").run(email, passwordHash);
            return Response.json({message: "Đăng ký thành công"}, {status: 201, headers: corsHeaders});
            
            } catch (e) {
                if (e.message.includes("UNIQUE")) {
                    return Response.json({error: "Email đã tồn tại"}, {status: 400, headers: corsHeaders});
                }
                return Response.json({ error: "Lỗi hệ thống"}, { status: 500, headers: corsHeaders});
            }
        }

        //2. AUTH: LOGIN
        if (url.pathname === "/auth/login" && method === "POST"){
            const { email, password } = await req.json();
            const user = db.query("SELECT * FROM users WHERE email = ?").get(email);

            if (!user) return Response.json({ error: "User không tồn " }, { status: 401, headers: corsHeaders});

            const isMatch = await Bun.password.verify(password, user.passwordHash);
            if (!isMatch) return Response.json({ error: "Sai mật khẩu"}, { status: 401, headers: corsHeaders});

            //Tạo thẻ thông hành (Token)
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h'});
            return Response.json({ token}, {headers: corsHeaders});
        }

        //3. MIDDLEWARE CHECK TOKEN (cho các route/ tasks)
        let currentUser = null;
        if (url.pathname.startsWith("/tasks")){
            const authHeader = req.headers.get("Authorization");
            const token = authHeader?.split(" ")[1];

            if (!token) return Response.json({ error: "Cần đăng nhập" }, { status: 401, headers: corsHeaders});

            try {
                currentUser = jwt.verify(token, JWT_SECRET);
            } catch (e) {
                return Response.json({ error: "Token hết hạn hoặc sai" }, { status: 401, headers: corsHeaders });
            }
         }

         //4.ROUTE TASKS (đã được bảo vệ)
         if (url.pathname === "/tasks" && method === "GET") {
            const userTasks = db.query("SELECT * FROM tasks WHERE userId = ?").all(currentUser.userId);
            return Response.json(userTasks, { headers: corsHeaders});   
         }

         if (url.pathname === "/tasks" && method === "POST") {
            const body = await req.json();
            const result = db.prepare("INSERT INTO tasks (userId, title) VALUES(?, ?) RETURNING *")
                             .get(currentUser.userId, body.title);
            return Response.json(result, {headers: corsHeaders, status: 201});      
         }

         if (url.pathname === "/health" && method === "GET") {
            return  Response.json({ ok: true}, {headers: corsHeaders});
         }

         return new Response("Not Found", { status: 404, headers: corsHeaders});
        },
    });
console.log("Backend đang chạy tại http://localhost:3000");
