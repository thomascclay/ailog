import React from 'react';
import {FeedbackForm} from './Pages/index';
import './App.css';
import {AuthUser} from "./context/UserContext";

function App() {
  return (
      <AuthUser>
        <FeedbackForm/>
      </AuthUser>
  );
}

export default App;
