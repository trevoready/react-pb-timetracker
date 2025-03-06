import React, { useContext, useEffect } from "react";
import client from "../pbconn";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();

  async function signup(email, password, password_confirmation, name) {
    return client.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: password_confirmation,
      name: name,
    });
  }

  async function signin(username, password) {
    return client.collection("users").authWithPassword(username, password);
  }

  async function logout() {
    return client.authStore.clear();
  }

  useEffect(() => {
    const unsubscribe = client.authStore.onChange((user) => {
      console.log(client.authStore.model);
      if (!client.authStore.isValid) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(client.authStore.model);
    }, true);
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    signin,
    logout,
    signup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
