import { Navigate } from "react-router-dom";
//import navigate để chuyển hướng

export default function RequireAuth({ children }) {
    // component bọc các page cần đăng nhập
    // children là các page được bọc

    const token = localStorage.getItem("token");
    //lấy token từ localStorage
    //nếu chưa đăng nhập thì token sẽ là null

    if (!token) {
        //nếu không có token (chưa đăng nhập)

        return <Navigate to="/login" replace />;
        //chuyển hướng về trang đăng nhập
        //replace để ko cho quay lại trang trước bằng nút back
    }

    return children;
    //nếu có token (đã đăng nhập) -> cho phép render page bên trong
}