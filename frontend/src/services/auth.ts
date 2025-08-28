import api from "./api";

export async function loginAsync(email: string, password: string) {
  const user = await api.post("auth/login", {
    email,
    password,
  });
  return user;
}
