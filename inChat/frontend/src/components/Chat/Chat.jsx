import React from "react";
import styles from './Chat.module.css';
import { w3cwebsocket as W3WebSocket } from "websocket";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomName, setRoomName] = useState('test');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function handleErrors(response) {
        response.json().then((detail) => {
            if (detail['detail'] === 'Authentication credentials were not provided.') {
                navigate('/login');
            } else {
                setIsAuthenticated(true);
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

    useEffect(() => {
        const chatSocket = new W3WebSocket('ws://localhost:8000/ws/chat/' + roomName + '/');
        chatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
        }
    });

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.status;
        } else {
            throw Error(response.statusText);
        }
    }

    const Logout = () => {
        fetch("http://localhost:8000/api/v2/logout", {
            credentials: "include",
        })
            .then(isResponseOk)
            .then((data) => {
                console.log(data);
                setIsAuthenticated(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div>
                <p className={styles.p}>Hi, you're in chat</p>
            </div>
            <div>
                <button onClick={Logout}>Log Out</button>
            </div>
        </div>
    )

}

export default Chat;