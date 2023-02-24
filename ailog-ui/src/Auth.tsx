import React from 'react';
import {API_URL} from "./config";

type User = {

  username: string,

}
export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}>({
  isAuthenticated: false,
  user: null,
  token: null,
});


export const Login: React.FC<{
  handleLogin: (user: User, token: string) => void;
}> = ({handleLogin}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit: React.EventHandler<any> = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(r => {
      if (r.status === 200) {
        r.json().then(({token, user}) => {
          handleLogin(user, token);
        }).catch(console.error);
      } else {
        alert('Invalid username or password');
      }
    }).catch(console.error)
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export const AuthProvider = (props: any) => {

  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [user, setUser] = React.useState<User|null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!token);

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('token', token);
    setUser(user);
    setToken(token);
    setIsAuthenticated(!!user && !!token);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: isAuthenticated,
        user,
      }}>
      {isAuthenticated && props.children || <Login handleLogin={handleLogin}/>}
    </AuthContext.Provider>
  );
};