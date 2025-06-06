import React, { useState, useRef } from 'react';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import { TextField, Paper, IconButton, Avatar, Typography, Box } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import Zoom from '@mui/material/Zoom';
import avatarLogo from "../../assets/boga-logo.svg";
import { hacerPregunta } from '../api/chatIaApi';
import { useAuth } from '../../components/context/AuthContext';
// Placeholder ChatWindow component
const ChatWindow = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
      
    ]);
    const [inputText, setInputText] = useState('');
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const { user } = useAuth();

    const handleSendMessage = async () => {
        if (!user) {
            console.warn("Chat: User not authenticated. Cannot send message.");
            const authMessage = {
                id: Date.now(),
                text: 'Debes iniciar sesión para poder chatear.',
                sender: 'other',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: avatarLogo
            };
            setMessages((prevMessages) => [...prevMessages, authMessage]);
            return;
        }

        if (inputText.trim()) {
            const userMessage = {
                id: Date.now(),
                text: inputText,
                sender: 'user',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: '/path/to/user-avatar.png' // Consider making user avatar dynamic
            };
    
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            const pregunta = inputText;
            setInputText('');
    
            try {
                const respuestaApi = await hacerPregunta(user.username, pregunta);
// 'user' from AuthContext is the username string
                
                let aiText = "No se pudo interpretar la respuesta de la IA.";
                if (typeof respuestaApi === 'string') {
                    aiText = respuestaApi;
                } else if (respuestaApi && typeof respuestaApi.respuesta === 'string') {
                    aiText = respuestaApi.respuesta;
                } else if (respuestaApi && typeof respuestaApi.text === 'string') {
                    aiText = respuestaApi.text;
                } else if (respuestaApi && typeof respuestaApi.message === 'string') {
                    aiText = respuestaApi.message;
                } else if (respuestaApi && Object.keys(respuestaApi).length > 0) {
                    // Fallback if a known field isn't found but it's an object
                    aiText = JSON.stringify(respuestaApi);
                }
    
                const iaMessage = {
                    id: Date.now() + Date.now().toString(36).slice(-4), // More unique ID
                    text: aiText,
                    sender: 'other',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: avatarLogo
                };
    
                setMessages((prevMessages) => [...prevMessages, iaMessage]);
            } catch (error) {
                console.error("❌ Error consultando la IA:", error);
                const errorMessage = error.message || "Hubo un error procesando tu consulta. Intenta de nuevo. 😢";
                setMessages((prevMessages) => [...prevMessages, {
                    id: Date.now() + Date.now().toString(36).slice(-3), // More unique ID
                    text: errorMessage,
                    sender: 'other',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: avatarLogo
                }]);
            }
        }
    };
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Image selected:', file.name);
            // Placeholder for image sending logic
            const reader = new FileReader();
            reader.onload = (e) => {
                setMessages([...messages, { id: Date.now(), type: 'image', content: e.target.result, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), avatar: '/path/to/user-avatar.png' }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Audio selected:', file.name);
            // Placeholder for audio sending logic
             const reader = new FileReader();
            reader.onload = (e) => {
                setMessages([...messages, { id: Date.now(), type: 'audio', content: e.target.result, fileName: file.name, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), avatar: '/path/to/user-avatar.png' }]);
            };
            reader.readAsDataURL(file);
        }
    };

    // The Zoom transition will handle visibility, so we don't return null based on 'open' here.
    return (
        <Zoom in={open} timeout={350} style={{ transformOrigin: 'calc(100% - 28px) calc(100% + 48px)' }} unmountOnExit>
            <Paper elevation={5} sx={{
            position: 'fixed',
            bottom: '100px', // Above the FAB
            right: '24px',
            width: '375px',
            height: '600px',
            backgroundColor: '#f7f7f7',
            borderRadius: '15px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1300, // Above FAB
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // To ensure rounded corners clip content
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'white',
                borderBottom: '1px solid #e0e0e0',
            }}>
                <Avatar src={avatarLogo} sx={{ width: 55, height: 55, marginRight: '12px' }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Boga</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chat IA</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ marginLeft: 'auto' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '8px',
                    }}>
                        {msg.sender === 'other' && <Avatar src={msg.avatar} sx={{ width: 32, height: 32, marginRight: '8px', alignSelf: 'flex-end' }} />}
                        <Box sx={{
                            maxWidth: '70%',
                            padding: '8px 12px',
                            borderRadius: '18px',
                            backgroundColor: msg.sender === 'user' ? 'rgb(43, 40, 61)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            border: msg.sender === 'other' ? '1px solid #e0e0e0' : 'none',
                            wordBreak: 'break-word',
                        }}>
                            {msg.type === 'image' && <img src={msg.content} alt="uploaded content" style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px' }} />}
                            {msg.type === 'audio' && 
                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                                    <Typography variant="caption" sx={{fontStyle: 'italic', marginBottom: '4px'}}>{msg.fileName}</Typography>
                                    <audio controls src={msg.content} style={{ maxWidth: '100%', height: '40px' }} />
                                </Box>
                            }
                            {(!msg.type || msg.type === 'text') && <Typography variant="body2">{msg.text}</Typography>}
                            <Typography variant="caption" sx={{
                                display: 'block',
                                textAlign: 'right',
                                fontSize: '0.7rem',
                                color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                                marginTop: '4px'
                            }}>
                                {msg.time}
                            </Typography>
                        </Box>
                        {msg.sender === 'user' && <Avatar src={msg.avatar} sx={{ width: 32, height: 32, marginLeft: '8px', alignSelf: 'flex-end' }} />}
                    </Box>
                ))}
            </Box>

            {/* Input Area */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: 'white'
            }}>
                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioUpload} style={{ display: 'none' }} />
                
                <IconButton onClick={() => imageInputRef.current.click()} sx={{color: 'text.secondary'}} titleAccess="Attach image">
                    <AttachFileIcon />
                </IconButton>
                {/* Audio input is available via audioInputRef but not directly shown to match image. 
                    Could be triggered by a menu from AttachFileIcon or a dedicated icon if design changes. */}
                {/* <IconButton onClick={() => audioInputRef.current.click()} sx={{color: 'text.secondary'}} titleAccess="Attach audio">
                    <MicIcon /> // Assuming MicIcon is imported if used
                </IconButton> */}
           
                <IconButton onClick={() => audioInputRef.current.click()} sx={{color: 'text.secondary'}} titleAccess="Send audio message">
                    <MicIcon />
                </IconButton>
                <TextField 
                    fullWidth 
                    variant="standard" 
                    placeholder="Write something..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    multiline
                    maxRows={3}
                    InputProps={{
                        disableUnderline: true,
                        sx: { 
                            padding: '8px 12px',
                            fontSize: '0.95rem'
                        }
                    }}
                    sx={{ marginX: '8px' }}
                />
                <IconButton onClick={handleSendMessage} sx={{color: 'rgb(43, 40, 61)'}}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    </Zoom>
    );
};

const ChatIa = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <Fab 
                aria-label="chat"
                onClick={handleToggleChat}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1200, 
                    backgroundColor: "rgb(43, 40, 61)",
                    color: "white",
                    '&:hover': {
                        backgroundColor: "rgb(67, 63, 91)",
                        color: "white"
                    }
                }}
            >
                <ChatIcon sx={{color:"white"}}/>
            </Fab>
            <ChatWindow open={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
};

export default ChatIa;
