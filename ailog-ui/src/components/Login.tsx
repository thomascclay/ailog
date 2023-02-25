import React from 'react';

export const Login: React.FC<{onLoginSubmit: (username: string, password: string) => void}> = ({onLoginSubmit}) => {
  const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
  const [password, setPassword] = React.useState('');

  const handleSubmit: React.EventHandler<any> = (event) => {
    event.preventDefault();
    onLoginSubmit(username, password);
  };

  return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit">Login</button>
      </form>
  );
};
