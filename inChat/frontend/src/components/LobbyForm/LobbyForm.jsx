import React from "react";
import styles from './LobbyForm.module.css';
import axios from 'axios';
import { useState, useLayoutEffect } from "react";
import { useNavigate } from 'react-router-dom';

const LobbyForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function get_user(response) {
        response.json().then((data) => {
            setUsername(data['username']);
        })
    }
    
    function handleErrors(response) {
        response.json().then((detail) => {
            if (detail['detail'] === 'Authentication credentials were not provided.') {
                navigate('/login', );
            } else {
                setIsAuthenticated(true);
                fetch("http://localhost:8000/api/v2/get_username/", {
                    credentials: "include",
                }).then(get_user).catch((err) => {
                    console.log(err);
                });
            }
        })
    }

    useLayoutEffect(() => {
        fetch("http://localhost:8000/api/v2/session/", {
            credentials: "include",
        }).then(handleErrors).catch((err) => {
            console.log(err);
        });
    }, []);

    const connectToChat = (room_name) => {
        navigate('/chat', {state: room_name});
    };

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.status;
        } else {
            throw Error(response.statusText);
        }
    }

    const Logout = () => {
        fetch("http://localhost:8000/api/v2/logout/", {
            credentials: "include",
        })
            .then(isResponseOk)
            .then((data) => {
                console.log(data);
                setIsAuthenticated(false);
                navigate('/login');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let intervalID = null;

        if (roomName === '') {
            intervalID = setInterval(() => {
                axios.post('http://localhost:8000/api/v2/cache_features/', {
                    "username": username,
                }).then((response) => {
                    setRoomName(response.data.room_name);
                    console.log(response.data.room_name);
                    if (response.data.room_name !== username){
                        clearInterval(intervalID);
                        console.log('connection...');
                        connectToChat(response.data.room_name);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }, 2000);
        }
    };


    return (
        <div>
            <div>
                <p className={styles.p}>Hi, you're in chat, {username}</p>
            </div>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='submit' value="start chatting"/>
                </form>
            </div>
            <div>
                <button onClick={Logout}>Log Out</button>
            </div>
        </div>
    )

}

export default LobbyForm;