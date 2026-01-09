#day 2

#HTML
1. <div> khối chứa 
- Gom nhóm các phần tử lại với nhau
- Dùng để chia layout
+VD:
<div>
    <h1>Tiêu đề</h1>
    <p>Nội dung</p>
</div>

2.<form> Biểu mẫu
- Dùng để gửi dữ liệu (đăng nhập, đăng ký, tìm kiếm...)
+VD:
<form>
  <! -- input, button nằm trong đây -->
</form>

3.<input> - Ô nhập dữ liệu
- Cho người dùng nhập thông tin
+VD:
<input type="text" placeholder="Nhập tên">

4.<button> - nút bấm
- dùng để bấm thực hiện hành động
+VD:
<button>Đăng Nhập</button>

5.<label> - nhãn cho input
- gắn chữ mô tả cho input
- click vào lablel -> focus vào input
+VD:
<label for="email">Email</label>
<input id= "email" type="email">

6. a - link
- dùng để chuyển trang
+VD:
<a href="https://google.com>Tới Google</a>

#CSS
1. Box Model
- content -> padding -> border -> margin

.box {
    width: 200px;
    padding: 10px;
    border: 2px solid black;
    margin: 20px;
}

2. display: flex - layout
.container {
    display: flex;
    justify-content: center; //ngang
    align-items: center; //dọc
}
-justify-content → trục chính
-align-items → trục phụ

3. gap : khoảng cách giữa các item
.container {
    display: flex;
    gap: 16px;
}

4. padding
-tạo khoảng cách từ viền vào nội dung
.box {
    padding: 10px; //all
    padding: 10px 20px; //trên dưới, trái phải
    padding: 10px 20px 30px 40px; //top right bottom left
}

5. max-width-giới hạn chiều rộng
.container {
    max-width: 1200px;
}

6.margin: 0 auto - căn giữa ngang