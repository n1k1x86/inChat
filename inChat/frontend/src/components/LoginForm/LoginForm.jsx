import styles from "./LoginForm.module.css";


const LoginForm = () => {
    return (
        <div>
            <p className={styles.form_title}>Login Form</p>
            <form className={styles.form_style}>
                <input type="text"
                    placeholder="login" />
                <input type="password" 
                    placeholder="password"/>
                <input type="submit"
                    value="Login"
                 />
            </form>
        </div>
    );
}

export default LoginForm;
