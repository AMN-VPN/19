// Load recordings with precise room filtering
// بارگذاری و نمایش پیام‌های صوتی اتاق
async function loadRoomContent() {
    console.log('Loading room content for:', currentRoom);
    const recordings = await db.voices
        .where('roomCode')
        .equals(currentRoom)
        .toArray();
    console.log('Loaded recordings:', recordings.length);
    
    recordings.forEach(recording => {
        console.log('Processing recording:', recording.voiceId);
    });
}
// مدیریت تغییر اتاق و بروزرسانی وضعیت
function changeRoomState(newRoomCode) {
    console.log('Room state change requested:', newRoomCode);
    currentRoom = newRoomCode;
    document.getElementById('currentRoomDisplay').textContent = `اتاق فعلی: ${newRoomCode}`;
    console.log('Room state updated successfully');
}

// بررسی و مدیریت اتصالات فعال در اتاق
function monitorRoomConnections() {
    console.log('Monitoring room connections');
    connections.forEach((conn, index) => {
        console.log(`Connection ${index} status:`, conn.open ? 'active' : 'inactive');
    });
    console.log('Total active connections:', connections.filter(c => c.open).length);
}
class RoomManager {
    constructor() {
        console.log('Room Manager initialized');
        this.connections = new Map();
    }

    createRoom() {
        const roomCode = this.generateRoomCode();
        console.log(`Creating new room with code: ${roomCode}`);
        // کد موجود
    }

    joinRoom(roomCode) {
        console.log(`Attempting to join room: ${roomCode}`);
        // کد موجود
    }

    // Room management function
    changeRoom(newRoomCode) {
        console.log('Changing room to:', newRoomCode);
        currentRoom = newRoomCode;
        loadExistingRecordings();
        console.log('Room change complete');
    }

    // Generate unique room code
    generateRoomCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated room code:', code);
        return code;
    }
}

async function loadExistingRecordings() {
    console.log('Loading recordings for current room');
    document.getElementById('recordings').innerHTML = '';
   
    const recordings = await db.voices
        .where('roomCode')
        .equals(currentRoom)
        .toArray();
    console.log(`Found ${recordings.length} recordings in database`);

    recordings
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(recording => {
            console.log('Processing recording:', recording.voiceId);
            displayRecording(
                URL.createObjectURL(recording.blob),
                recording.userEmail !== currentUser.email,
                recording.timestamp,
                recording.voiceId,
                recording.userEmail
            );
        });
}

function initializeRoomControls() {
    console.log('Initializing room controls');
    
    document.getElementById('createRoom').onclick = () => {
        console.log('Create room button clicked');
        const roomCode = generateRoomCode();
        console.log('New room code generated:', roomCode);
        changeRoom(roomCode);
        initializePeer(roomCode, true);
    };

    document.getElementById('joinRoom').onclick = () => {
        console.log('Join room button clicked');
        const roomCode = document.getElementById('joinRoomInput').value.trim();
        console.log('Attempting to join room:', roomCode);
        
        if (roomCode.length !== 6) {
            console.log('Invalid room code format');
            alert('لطفاً یک کد 6 رقمی معتبر وارد کنید');
            return;
        }
        
        changeRoom(roomCode);
        initializePeer(roomCode, false);
    };
}    };
}

function initializePeer(roomCode, isCreator) {
    peer = new Peer(generatePeerId(roomCode), {
        config: { iceServers: CONFIG.STUN_SERVERS }
    });

    peer.on('connection', (conn) => {
        console.log('New peer connected:', conn.peer);
        setupConnection(conn);
    });
}
