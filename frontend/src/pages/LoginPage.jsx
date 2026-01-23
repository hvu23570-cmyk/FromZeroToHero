import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
    //State lưu email
    const [email, setEmail] = useState("");
    //State lưu password
    const [password, setPassword] = useState("");
    //State lưu thông báo lỗi
    const [error, setError] = useState("");
    //State loading
    const [loading, setLoading] = useState(false);
    //Hook điều hướng
    const navigate = useNavigate();
    //Xử lý submit từ login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        //FE VALIDATE
        if (!email.includes("@")) {
            setError("Email không hợp lệ");
            return;
        }
        
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        try {
            //Bật trạng thái loading (disable button)
            setLoading(true);

            //Gọi API login
            await login(email, password);

            //thành công -> chuyển trang
            navigate("/tasks");

        } catch (err) {
            setError(err.message || "Đăng nhập thất bại");
        } finally {
            //tắt loading dù thành công hay thất bại
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                {/* Hiển thị lỗi nếu có */}
                {error && <div className="error-message">{error}</div>}

                {/* Label + Input Email */}
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Label + Input Password */}
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Nút submit bị disable khi loading */}
                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p>
                    Chưa có tài khoản?
                    <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
}