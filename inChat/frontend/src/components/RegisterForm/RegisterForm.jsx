import styles from './RegisterForm.module.css';

const RegisterForm = () => {
    return (
        <div>
            <p className={styles.form_title}>Register Form</p>
            <form className={styles.form_style}>
                <input type="text"
                    placeholder='login'/>
                <input type="password"
                    placeholder='password'/>
                <input type="password"
                    placeholder='confirm password'/>
                <input type='submit'
                    value='Register'/>
            </form>
        </div>
    );
}

export default RegisterForm;
