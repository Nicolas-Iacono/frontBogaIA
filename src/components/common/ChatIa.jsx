import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
// import ChatWindow from './ChatWindow'; // Assuming ChatWindow will be in the same directory or adjust path

// Placeholder ChatWindow component
const ChatWindow = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div style={{
            position: 'fixed',
            bottom: '100px', // Above the FAB
            right: '24px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1300, // Above FAB
            display: 'flex',
            flexDirection: 'column',
            padding: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4>Chat IA</h4>
                <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                {/* Chat messages would go here */}
                <p>Chat window content...</p>
            </div>
            <input type="text" placeholder="Escribe tu mensaje..." style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
        </div>
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
