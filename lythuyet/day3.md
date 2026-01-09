#CONST
- không được gắn lại
- dùng cho giá trị không đổi 
- VD:
const PI = 3.14; //gán rồi thì ko thay đổi được
PI = 4; //ko được
PI = PI + 1; //ko được

#LET
- có thể gán lại
- dùng cho biến thay đổi theo thời gian
- VD:
let count = 0;
count  = count + 1;

#CONST VỚI OBJECT/ARRAY
- const khóa biến, không khóa nội dung
- VD:
const user = { name : "Hieu" };
user. name = "Bro";
-> ko gán lại biến user
-> chỉ sửa thuộc tính bên trong object

#FUNCTION (hàm)
- dùng để tái sử dụng logic

- FUNCTION THƯỜNG :
function add(a, b){
    return a + b;
}

add(2, 3); //in ra 5

- ARROW FUNCTION : ngắn gọn hơn function thường
const add = (a, b) => a + b;
add(2, 3); //in ra 5

- ARRAY METHODS :

- MAP() : biến đổi từng phần tử
- VD:
const nums = [1, 2, 3];
const double = nums.map(n => n * 2); //[2, 4, 6]
-> trả về mảng mới

- FILTER() : lọc phần tử
- VD:
const nums = [1, 2, 3, 4];
const even = nums.filter(n => n % 2 == 0); //[2, 4]
=> lọc ra điều kiện đúng giữ lại


-FIND() : tìm 1 phần tử đầu tiên
-VD:
const nums = [1, 3, 4, 6];
function checkNum(nums) {
    return nums > 2;
}

const result = nums.find(checkNum);
console.log(result); //3

-> viết gọn bằng arrow : 
const nums = [1, 3, 4, 6];
const result = nums.find(num => num > 2);
console.log(result); //3

#ASYNC / AWAIT + FETCH
* khi đặt async trước một hàm, hàm đó sẽ luôn trả về một PROMISE
- giá trị trả về trong hàm async sẽ được tự động đóng gói thành Promise.resolve(value).
- VD: 
async function hello(){
    return "Hi bro";
}
hello().then(value => console.log(value)); //hi bro

-> function hello(){
    return Prommie.resolve("Hi bro");
}

* AWAIT chỉ được dùng bên trong hàm async
- pause việc thực thi hàm cho đến khi PROMISE được hoàn thành rồi lấy giá trị đó
- chờ cho promise trả xong rồi mới chạy dòng tiếp theo
- VD :
async function showMessage(){
    let promise = new Promise(resolve => resolve(" I love you"));
    let result = await promise //chờ promise hoàn thành
    console.log(result);
}
showMessage(); //i love you

- Ví dụ chờ 3 giây
async function wait3s(){
    let promise = new Promise(resolve => {
        setTimeout(() => resolve("done after 3s"), 3000);
    });
    let result = await promise;
    console.log(result);
}
wait3s();

*FETCH()
- fetch api là một cách hiện đại để gửi yêu cầu http từ trình duyệt đến server(lấy dữ liệu, file...)

- fetch cơ bản:
fetch("URL")
  .then(response => response.text())
  .then(data => {
    console.log(data);
  });

- dùng async/await với fetch
- code đơn giản, dễ đọc hơn
async function getText(file){
    let response = await fetch(file);
    let text = await response.text();
    console.log(text);
}
getText("file.txt");
-> await chờ fetch xong rồi mới chạy tiếp
-> async là bắt buộc nếu muốn dùng await bên trong hàm
