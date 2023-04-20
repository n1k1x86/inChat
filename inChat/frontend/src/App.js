import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import styles from './App.module.css';


const App = () => {
  return (
    <div className={styles.body_style}>
      <Routes>
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/register" element={<RegisterForm />}/>
      </Routes>
    </div>
  );
}

export default App;
