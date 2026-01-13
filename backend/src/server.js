//dữ liệu mẫu 
let tasks = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
];

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

        //1. GET /health -> trả về JSON
        if (url.pathname === "/health" && method === "GET") {
            return Response.json({ ok: true}, { headers: corsHeaders});
        }

        //2. GET /tasks -> trả về danh sách tasks
        if (url.pathname === "/tasks" && method === "GET"){
            return Response.json(tasks, { headers: corsHeaders});
        }

        //3. POST /tasks -> tạo task mới
        if (url.pathname === "/tasks" && method === "POST"){
            const body = await req.json();
            const newTask = { id: tasks.length + 1, ...body };
            tasks.push(newTask);
            return Response.json(newTask, { headers: corsHeaders, status: 201 });
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders});
        },
     });

console.log("Backend đang chạy tại http://localhost:3000");
