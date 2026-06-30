export type User = {
    id_user: number;
    name: string;
    email: string;
    role: "admin" | "user";
}

export type LoginRespone = {
    user: User;
    token: string;
}

export type  LoginInput = {
    email: string;
    password: string;
}