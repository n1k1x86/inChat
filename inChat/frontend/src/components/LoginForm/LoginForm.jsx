import styles from "./LoginForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

const LoginForm = () => {
    const navigate = useNavigate();
    const [csrf, setCsrf] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState('');
    const [errorUsername, setErrorUsername] = useState('Username field is required');
    const [errorPassword, setErrorPassword] = useState('Password field is required');
    const [isValidForm, setIsValidForm] = useState(false);
    
    function handleErrors(response) {
        response.json().then((detail) => {
            if (detail['detail'] === 'Authentication credentials were not provided.') {
                setIsAuthenticated(false);
                getCSRF();
            } else {
                setIsAuthenticated(true);
            }
        })

    }
    
    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.status;
        } else {
          throw Error(response.statusText);
        }
    }

    useEffect(() => {
        fetch("http://localhost:8000/api/v2/session/", {
            credentials: "include",
        }).then(handleErrors).catch((err) => {
            console.log(err);
        });
    }, []);

    const handleUsername = (e) => {
        let newUsername = e.target.value;

        setUsername(newUsername);
        if (newUsername === null || newUsername === '') {
            setErrorUsername('Username field is required');
        } else {
            setErrorUsername(null);
        }
    };

    const handlePassword = (e) => {
        let newPassword = e.target.value;

        setPassword(newPassword);
        if (newPassword === null || newPassword === '') {
            setErrorPassword('Password field is required');
        } else {
            setErrorPassword(null);
        }
    };
    
    const handleCSRF = (response) => {
        response.json().then((data) => {
            setCsrf(data['X-CSRFToken']);
        })
    }

    const getCSRF = () => {
        fetch("http://localhost:8000/api/v2/csrf/", {
          credentials: "include",
        })
        .then(handleCSRF)
        .catch((err) => {
          console.log(err);
        });
      }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (errorPassword === null && errorUsername === null) {
            setIsValidForm(true);
        }

        if (isValidForm) {
            fetch('http://localhost:8000/api/v2/login/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf
                },
                credentials: 'include',
                body: JSON.stringify({
                    'username': username,
                    'password': password,
                }),
            }).then(isResponseOk)
            .then((data) =>{
                console.log(data);
                setIsAuthenticated(true);
                setUsername('');
                setPassword('');
            })
            .catch((error) => {
                console.log(error);
            })

        }

    }
    if (!isAuthenticated) {
        return (
            <div>
                <p className={styles.form_title}>Login Form</p>
                <form className={styles.form_style} onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" onChange={(e) => handleUsername(e)}
                        placeholder="login" />
                    <p>{errorUsername}</p>
                    <input type="password" onChange={(e) => handlePassword(e)}
                        placeholder="password" />
                    <p>{errorPassword}</p>
                    <input type="submit"
                        value="Sign In"
                    />
                </form>
            </div>
        );
    } else {
        navigate('/lobby');
    }
}

export default LoginForm;
