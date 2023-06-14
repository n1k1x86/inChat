import styles from './WelcomePage.module.css'
import { Navigate, useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleToSignIn = (e) => {
        navigate('/login');
    }

    const handleToSignUp = (e) => {
        navigate('/register');
    }

    return (
        <div className={styles}>
            <div className={styles.greeting}>
                <p color="white">Welcome to Inchat!</p>
                <p color='white'>You can sign up you account or if you have it, sign in!</p>
            </div>
            <div>
                <button onClick={(e) => handleToSignIn(e)} className={styles.glow_on_hover} type="button">Sign In</button>
                <button onClick={(e) => handleToSignUp(e)} className={styles.glow_on_hover} type="button">Sign Up</button>
            </div>
        </div>
    )
}

export default WelcomePage;