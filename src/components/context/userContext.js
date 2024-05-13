import axios from "axios";
import { useState, createContext } from "react";

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const authLogin = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get("/api/admin/login", {
        params: { token },
      });
      console.log(response.data);
      setUser(response.data.user[0]);
    } else {
      setUser({ auth: false });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    console.log("logout");
    setUser({ auth: false });
  };

  return (
    <UserContext.Provider value={{ user, authLogin, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
