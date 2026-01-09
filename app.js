const form = document.getElementById("loginform"); //lấy form html bằng id
const input = document.getElementById("email"); //lấy ô input email
const password = document.getElementById("password"); //lấy ô input password

function validate(email, password) {
  //hàm kiểm tra tính hợp lệ của email và mk
  console.log(email, password);
  if (!email.includes("@") || password.length < 6) {
    alert("Email hoặc mật khẩu của bạn không hợp lệ!");
    return false; //ko hợp lệ
  } else return true; //hợp lệ
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); //ngăn chặn hành vi mặc định của form
  const email = input.value;
  const passwordValue = password.value;
  if (validate(email, passwordValue)) {
    alert("Đăng nhập thành công!");
  }
});

async function fetchtodos() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );
    const todos = await response.json();
    console.log("Todos:", todos);
    const titles = todos.map(function (todo) {
      //map lấy danh sách tiêu đề
      return todo.title;
    });
    console.log("Titles:", titles);
    const completedTodos = todos.filter(function (todo) {
      //filter lọc todo đã hoàn thành
      return todo.completed;
    });
    console.log("Completed Todos:", completedTodos);
    const firstcompleted = todos.find(function (todo) {
      //find tìm todo đã hoàn thành đầu tiên)
      return todo.completed;
    });
    console.log("First Completed Todo:", firstcompleted);
  } catch (error) {
    console.error("Lỗi:", error);
  }
}
fetchtodos();
