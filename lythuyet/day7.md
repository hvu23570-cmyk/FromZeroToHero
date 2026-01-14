1. Bun là gì ? Tại sao dùng Bun cho Backend ?
- Bun không chỉ là một trình chạy JavaScript như Node.js mà còn là một bộ công cụ tất cả trong một
+ tốc độ: cực nhanh
+ tích hợp sẵn Bun có sẵn HTTP server, trình quản lý gói (thay thế npm) và trình chạy test
+ cú pháp: có thể dùng trực tiếp Import/Export mà ko cần cấu hình rườm rà

2. Xây dựng server với Bun.serve
* Cấu trúc cơ bản 
Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/health") {
            return Response.json ({ ok: true});
        }
        return new Response("Not Found", { status: 404 });
    };
});

3. CORS (Cross-Origin Resource Sharing)
- Đây là người gác cổng quan trọng nhất khi FE và BE giao tiếp với nhau.
+ Vấn đề: Trình duyệt mặc định chặn các yêu cầu từ một "Origin" này (ví dụ: localhost: 5273) đến một "Origin" khác (localhost: 3000) vì lí do bảo mật
+ Giải pháp: Backend phải gửi một tín hiệu (Header) bảo trình duyệt rằng "tôi cho phép ông FE này lấy dữ liệu của tôi"

- Cách thức hoạt động của CORS:
- Các header quan trọng:

+ Access-Control-Allow-Origin: chỉ định domain nào được phép truy cập vào (ví dụ: http://locallhost:5173)

+ Access-Control-Allow-Methods: Các phương thức được phép (GET, POST,...)

+ Access-Control-Allow-Headers: Các loại header được phép gửi lên (ví dụ: Content-Type)

4. Xử lý HTTP Methods & Body
- Trong Backend chúng ta cần phải phân biệt các hành động dựa trên Method:
+ GET: dùng để lấy dữ liệu (không có body)
+ POST: dùng để gửi dữ liệ mới lên (có body dạng JSON)

- Ví dụ lấy Body trong Bun:
if (req.method === "POST" && url.pathname === "/tasks") {
    const body = await req.json(); //Bun giúp đọc body cực nhanh
    return Response.json({message: "Đã nhận", data: body});
}

*VÍ DỤ TỔNG HỢP: SERVER MẪU
- Dưới đây là hình dung về file server.js kết hợp cả Route và CORS

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        //1. xử lý CORS preflight khi FE gửi yêu cầu phức tạp
        if (req.method === "OPTIONS") {
            return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    //2. Logic chính
    let response;
    if (url.pathname === "/health") {
        response = Response.json({ ok: true});
    } else {
        response = new Response("Not Found", { status: 404 };)
    }

    //3. Thêm Headers CORS vào mọi response thành công
    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
    return response;
    },
});

console.log(`server đang chạy tại ${server.url}`);
