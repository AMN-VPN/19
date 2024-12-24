let peer;
let connections = [];
let currentRoom = null;

// راه‌اندازی و پیکربندی اتصال همتا به همتا
function initializeLocalConnection(roomCode) {
    console.log('Initializing local peer connection');
    const peerConfig = {
        config: { iceServers: CONFIG.STUN_SERVERS },
        debug: 2
    };
    console.log('Peer configuration set:', peerConfig);
    
    peer = new Peer(generatePeerId(roomCode), peerConfig);
    console.log('Peer instance created');
}

// مدیریت دریافت و ارسال داده‌های صوتی
function handleAudioExchange(audioData, peerId) {
    console.log('Processing audio exchange with peer:', peerId);
    const stats = {
        dataSize: audioData.byteLength,
        timestamp: Date.now(),
        peerId: peerId
    };
    console.log('Audio exchange stats:', stats);
}

// مدیریت اتصالات ورودی جدید
function handleNewConnection(conn) {
    console.log('New incoming connection:', conn.peer);
    connections.push(conn);
    setupConnectionListeners(conn);
    console.log('Connection setup complete');
}function setupConnectionListeners(conn) {
    console.log('Setting up connection listeners for:', conn.peer);
    
    conn.on('open', () => {
        console.log('Connection opened with:', conn.peer);
        sendExistingRecordings(conn);
    });

    conn.on('data', (data) => {
        console.log('Received data type:', data.type);
        console.log('Data size:', data.audioData?.byteLength || 0);
    });
}
