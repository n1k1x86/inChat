import styles from "./LoginForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsername, setErrorUsername] = useState('Username field is required');
    const [errorPassword, setErrorPassword] = useState('Password field is required');
    const [isValidForm, setIsValidForm] = useState(false);

    const handleUsername = (e) => {
        let newUsername = e.target.value;

        setUsername(newUsername);
        if (newUsername === null || newUsername == '') {
            setErrorUsername('Username field is required');
        } else {
            setErrorUsername(null);
        }
    };

    const handlePassword = (e) => {
        let newPassword = e.target.value;

        setPassword(newPassword);
        if (newPassword === null || newPassword == '') {
            setErrorPassword('Password field is required');
        } else {
            setErrorPassword(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (errorPassword === null && errorUsername === null){
            setIsValidForm(true);
        }

        if (isValidForm){
            axios.post("http://localhost:8000/api/v2/login/", {
                "username": username,
                "password": password
            }
            ).then((response) => {
                navigate('/chat');
            }
            ).catch((error) => {
                console.log(error);
            })
        }

    }

    return (
        <div>
            <p className={styles.form_title}>Login Form</p>
            <form className={styles.form_style} onSubmit={(e) => handleSubmit(e)}> 
                <input type="text" onChange={(e) => handleUsername(e)}
                    placeholder="login" />
                <p>{errorUsername}</p>
                <input type="password"  onChange={(e) => handlePassword(e)}
                    placeholder="password"/>
                <p>{errorPassword}</p>
                <input type="submit"
                    value="Login"
                 />
            </form>
        </div>
    );
}

export default LoginForm;
