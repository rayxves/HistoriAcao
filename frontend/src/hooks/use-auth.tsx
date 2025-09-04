import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loginAsync } from "@/services/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userToken = Cookies.get("auth_user");
    if (userToken) {
      setUser(userToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginAsync(email, password);
    Cookies.set("auth_user", response.data, { expires: 1 });
    setUser(response);
    return response;
  };

  const logout = () => {
    Cookies.remove("auth_user");
  };

  return { user, login, logout };
};
