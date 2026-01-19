import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [BackendStatus, setBackendStatus] = useState("Connecting...");

    //gọi GET/health hiển thị "OK"
    useEffect(() => {
        fetch("http://localhost:3000/health")
        .then((res) => res.json())
        .then((data) => {
            if (data.ok) setBackendStatus("OK");
        })
        .catch(() => setBackendStatus("Error"));
    }, []);


     
    // LOGIN THẬT
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

    // VALIDATE FE
        if(!email.includes("@") || password.length < 6){
            setError ("Email hoặc mật khẩu không hợp lệ!");
            return;
        }

        try {
            await login(email, password); //gọi backend + lưu token
            navigate("/tasks"); //chuyển trang
        } catch (err) {
            setError(err.message || "Login thất bại");
        }       
    };

    return (
        <div style={{ padding: "20px"}}>
            <h2>Login</h2>
            <p>Backend status: {BackendStatus === "OK" ? "OK" : BackendStatus}</p>
            {error && <p style={{color: "red"}}>{error}</p>}
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