import { Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegForm from './components/RegForm/RegForm';
import LobbyForm from './components/LobbyForm/LobbyForm';
import ChatForm from './components/ChatForm/ChatForm';
import WelcomePage from './components/WelcomePage/WelcomePage';
import styles from './App.module.css';


const App = () => {
  return (
    <div>
      <div className={styles.body_style}>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegForm />} />
          <Route path="/lobby" element={<LobbyForm />} />
          <Route path='/chat' element={<ChatForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
