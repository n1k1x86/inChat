import React from "react";
import styles from './ChatForm.module.css';
import axios from 'axios';
import { w3cwebsocket as W3WebSocket } from "websocket";
import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const ChatForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState(location.state);
    const [chatSocket, setChatSocket] = useState(new W3WebSocket('ws://localhost:8000/ws/chat/' + roomName + '/'))
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //const chatSocket = new W3WebSocket('ws://localhost:8000/ws/chat/' + roomName + '/');

    chatSocket.onmessage = (e) => {
        console.log(e);
        const data = JSON.parse(e.data);
        document.getElementById('text-field').value += (data.message  + ' sent by ' + data.username + '\n')
    }

    chatSocket.onclose = (e) => {
        console.log('closed...');
    }

    useLayoutEffect(() => {
        fetch("http://localhost:8000/api/v2/session/", {
            credentials: "include",
        }).then(handleErrors).catch((err) => {
            console.log(err);
        });
    }, []);

    function handleErrors(response) {
        response.json().then((detail) => {
            if (detail['detail'] === 'Authentication credentials were not provided.') {
                navigate('/login');
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

    function get_user(response) {
        response.json().then((data) => {
            setUsername(data['username']);
        })
    }

    const handleMessage = (e) => {
        let newMessage = e.target.value;
        console.log(newMessage);

        setMessage(newMessage);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(message);

        chatSocket.send(JSON.stringify({
            'message': message,
            'username': username
        }));

        document.getElementById('mes-field').value = '';
    }

    return (
        <div>
            <div>
                Welcome, to chat!
            </div>
            <div>
                <textarea id="text-field"></textarea>
            </div>
            <div>
                <form onSubmit={(e) => sendMessage(e)}>
                    <input id="mes-field" type='text' placeholder="enter your message" onChange={(e) => handleMessage(e)}/>
                    <input type='submit' value="send"/>
                </form>
            </div>
        </div>
    )
}

export default ChatForm;