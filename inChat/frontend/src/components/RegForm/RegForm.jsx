import styles from "./RegForm.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const RegForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorRep, setErrorRep] = useState(null);
    const [errorUser, setErrorUser] = useState('Username field is required');
    const [errorPass, setErrorPass] = useState('Password field is required');
    const [isValidForm, setIsValidForm] = useState(false);
    const [errorForm, setErrorForm] = useState(null);

    const handleUsername = (e) => {
        setErrorForm(null);

        let newUsername = e.target.value;
        setUsername(newUsername);

        if (newUsername === null || newUsername == '') {
            setErrorUser('Username field is required');
        } else {
            setErrorUser(null);
        }
    };

    const handlePassword1 = (e) => {
        setErrorForm(null);

        let newPassword1 = e.target.value;
        setPassword1(newPassword1);

        if (newPassword1 === null || newPassword1 == '') {
            setErrorPass('Password field is required');
        } else {
            setErrorPass(null);
        }
    }

    const handlePassword2 = (e) => {
        setErrorForm(null);

        let newPassword2 = e.target.value;
        setPassword2(newPassword2);

        if (newPassword2 !== password1) {
            setErrorRep('Repeated password incorrectly');
        } else {
            setErrorRep(null);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorForm(null);

        if (errorPass === null && errorRep === null && errorUser === null) {
            setIsValidForm(true);
        }

        if (isValidForm) {
            axios.post("http://localhost:8000/api/v2/register/", {
                "username": username,
                "password": password1
            }).then((response) => {
                if (response.data.error !== undefined) {
                    if (response.data.error['username'][0] == "user with this username already exists.") {
                        setErrorForm("This user already exists. Try to sign in.")
                    }
                } else{
                    localStorage.setItem('token', response.data.token);
                    navigate('/chat');
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    return (
        <div>
            <p className={styles.form_title}>Registration Form</p>
            <form className={styles.form_style} onSubmit={(e) => handleSubmit(e)}>
                <input type="text" onChange={(e) => handleUsername(e)}
                    placeholder="username" />
                <p>{errorUser}</p>
                <input type="password" onChange={(e) => handlePassword1(e)}
                    placeholder="password" />
                <p>{errorPass}</p>
                <input type="password" onChange={(e) => handlePassword2(e)}
                    placeholder="confirm password" />
                <p>{errorRep}</p>
                <input type="submit"
                    value="Sign Up"
                />
                <p><a href="/login">{errorForm}</a></p>
            </form>

        </div>
    );
}

export default RegForm;