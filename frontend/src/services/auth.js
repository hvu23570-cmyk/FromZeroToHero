const API_URL = "http://localhost:3000";

//REGISTER
//Register trên FE gọi BE trực tiếp ở dòng 6
export const register = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    //backend trả về json { message } hoặc { error }
    return res.json();
}

//LOGIN
export const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password}),
    });

    const data = await res.json();

//Nếu login thành công -> có token
if (data.token) {
    localStorage.setItem("token", data.token); //login trên fe lấy token cà lưu vào storage
}

return data;
};

//LOGOUT
export const logout = () => {
    localStorage.removeItem("token");
};