import React from "react";
import {Login} from "../components/Login";
import {useApi} from "../hooks/hooks";

export const UserContext = React.createContext<{
  token: string | null;
  username: string | null;
}>({
  token: null,
  username: null
});

export function AuthUser(props: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = React.useState<string | null>(localStorage.getItem('username'));
  const api = useApi()

  const handleLoginSubmit = (username: string, password: string) => {
    api.Login.post(username, password).then(({data: {token, username}}) => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setToken(token);
      setUsername(username);
    }).catch(console.error);
  }

  return (
      <UserContext.Provider value={{token, username}}>
        {token && username && props.children || <Login onLoginSubmit={handleLoginSubmit}/>}
      </UserContext.Provider>
  );
}