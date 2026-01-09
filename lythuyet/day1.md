#day 1

- http là giao thức truyền tải siêu văn bản trao đổi trên word wide web giúp kết nối máy khách và máy chủ

- Thành phần Request(yêu cầu) / Response(phản hồi) bao gồm :
+ Method: nói cho server biết mình muốn làm gì.
+ Path: chỉ ra tài nguyên nào trên server.
+ Headers: thông tin bổ sung cho yêu cầu
+ Body: dữ liệu gửi lên server

- 3 status code:
+ 200 (ok)
+ 404 not found (ko tìm thấy trang)
+ 500 internal server error (lỗi máy chủ) 

- Phân biệt FE và BE:
+ FE (Browser): Những gì đang hiển thị trên màn hình Google của bạn.
+ BE (Server): Máy chủ của Google nhận lệnh "GET" từ bạn và trả về dữ liệu.

- URL gồm 
+ Protocol (giao thức) phần đầu tiên của URL vd: http://

+ Domain (Tên miền) : địa chỉ máy chủ vd: google.com

+ Path (Đường dẫn) : vị trí cụ thể của một tệp tin vd : facebook.com/messages/t/123, path la /messages/t/123

+ Querry (Tham số truy vấn) :bắt đầu sau dấu ? dùng để gửi thêm dữ liệu lên server để lọc hoặc tìm kiếm 
+ Giúp server trả về kết quả chính xác dựa trên yêu cầu riêng biệt của bạn (như tìm kiếm, lọc giá sản phẩm, phân trang

* Ví dụ tổng hợp:
* Giả sử bạn có URL: https://shopee.vn/search?keyword=laptop
- Protocol: https
- Domain: shopee.vn
- Path: /search (Trang tìm kiếm)
- Query: ?keyword=laptop (Yêu cầu server tìm các sản phẩm liên quan đến "laptop")

*CÁC STATUS CODE
- 200: ok : yêu cầu thực hiện thành công 
- 201: created : yc thành công và 1 tài nguyên mới đã được tạo ra
- 400 bad request : lỗi cú pháp, thiếu thông tin
- 401 Unauthorized : chưa đn hoặc k có quyền truy cập, cần cung cấp thông tin xác thực
- 404 not found: server ko tìm thấy tài nguyên
- 500 internal server error: lỗi phía máy chủ
