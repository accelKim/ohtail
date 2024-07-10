import axios from 'axios';
import React, { useState } from 'react';
import style from '../../styles/Chatbot.module.css';
const apiUrl = process.env.REACT_APP_API_URL;

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        try {
            const userMessage = { role: 'user', content: message };
            setChatHistory((prevHistory) => [...prevHistory, userMessage]);
            const response = await axios.post(`https://ohtail:80/api/chatbot`, {
                userPrompt: message,
            });
            const botMessage = { role: 'bot', content: response.data };
            setChatHistory((prevHistory) => [...prevHistory, botMessage]);
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    return (
        <div className={`chatbot ${style.chatbot}`}>
            <button onClick={toggleChat}>
                <i className="fa-solid fa-robot"></i>
            </button>
            <div className={`${style.chatContainer} ${isChatOpen ? style.show : ''}`}>
                <div>
                    <h2>Chat History:</h2>
                    <div>
                        {chatHistory.map((chat, index) => (
                            <p key={index} className={chat.role}>
                                <strong>{chat.role === 'user' ? 'You' : 'Bot'}: </strong>
                                {chat.content}
                            </p>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                    />
                    <button type="submit">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
                <button onClick={closeChat} className={`${style.chatConClose}`}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
