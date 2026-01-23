import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
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

    try{
      setLoading(true); //bật trạng thái loading
      await register(email, password); //gọi API register
      //đăng ký thành công
      alert("Đăng ký thành công");
      navigate("/login");

    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>

        {/* Hiển thị lỗi nếu có */}
        {error && <div className="error-message">{error}</div>}

        {/* Label + Input Email */}
        <label htmlFor="email">Email</label>
        <input
            id="email"
            type='email'
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
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p>
          Đã có tài khoản
          <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
