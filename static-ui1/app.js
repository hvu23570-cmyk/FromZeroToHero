const form = document.getElementById('loginform'); //lấy form html bằng id
const input = document.getElementById('email');//lấy ô input email
const password = document.getElementById('password');//lấy ô input password

function validate(email, password){ //hàm kiểm tra tính hợp lệ của email và mk
    console.log(email, password);
    if(!email.includes("@") || password.length < 6 ) {
        alert("Email hoặc mật khẩu của bạn không hợp lệ!");
        return false; //ko hợp lệ
   } else return true; //hợp lệ 
}

form.addEventListener('submit', function(event){
    event.preventDefault(); //ngăn chặn hành vi mặc định của form
    const email = input.value;
    const passwordValue = password.value;
    if(validate(email, passwordValue)) {
        alert("Đăng nhập thành công!");
    }
});