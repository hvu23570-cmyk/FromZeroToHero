import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!email.includes("@") || password.length < 6){
            alert("Email hoặc mật khẩu không hợp lệ!");
            return;
        }
        localStorage.setItem("token", "fake-token");
        navigate("/tasks");
    };

    return (
        <div style={{ padding: "20px"}}>
            <h2>Login</h2>
            {/* Gắn hàm xử lý sự kiện vào form */}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                    type="email" placeholder="Email"
                    value={email}
                    //cập nhật statue email ngay khi người dùng gõ phím   
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                    type="password" //ẩn các ký tự khi nhập mật khẩu 
                    placeholder="Password"
                    value={password} //liên kết giá trị ô nhập với state password
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Nút bấm có type="submit" để kích hoạt hàm handleSubmit */}
                <button type="submit">Login</button>
            </form>                                                                                                                                                                                                                                     
        </div>
    );  
}