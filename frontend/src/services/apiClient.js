const baseURL = "http://localhost:3000";

export async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type" : "application/json",
        ...options.headers,
    };

    if(token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(baseURL + path, {
        ...options,
        headers,
    });

    return res.json();
}