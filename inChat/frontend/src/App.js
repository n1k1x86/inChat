import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegForm from './components/RegForm/RegForm';
import Chat from './components/Chat/Chat';
import styles from './App.module.css';


const App = () => {
  return (
    <div className={styles.body_style}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegForm />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
    </div>
  );
}

export default App;
