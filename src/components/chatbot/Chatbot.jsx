import axios from 'axios';
import React, { useState } from 'react';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        try {
            const userMessage = { role: 'user', content: message };
            setChatHistory((prevHistory) => [...prevHistory, userMessage]);

            const response = await axios.post('http://localhost:8080/chatbot', {
                userPrompt: message,
            });
            const botMessage = { role: 'bot', content: response.data };
            setChatHistory((prevHistory) => [...prevHistory, botMessage]);

            setMessage('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>GPT Chatbot</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message"
                />
                <button type="submit">Send</button>
            </form>
            <div>
                <h2>Chat History:</h2>
                {chatHistory.map((chat, index) => (
                    <p key={index} className={chat.role}>
                        <strong>{chat.role === 'user' ? 'You' : 'Bot'}: </strong>
                        {chat.content}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Chatbot;
