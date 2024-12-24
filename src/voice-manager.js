// Database structure upgrade
db.version(2).stores({
    voices: '++id, voiceId, blob, timestamp, roomCode, userEmail'
});
console.log('Database schema initialized');

// Unique voice ID generator
function generateVoiceId() {
    const voiceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated voice ID:', voiceId);
    return voiceId;
}

// مدیریت ضبط صدا و ذخیره‌سازی
mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const timestamp = Date.now();
    const voiceId = generateVoiceId();

    // ارسال به همه کاربران متصل
    if (connections.length > 0) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        connections.forEach(conn => {
            if (conn.open) {
                conn.send({
                    type: 'audio',
                    audioData: arrayBuffer,
                    timestamp: timestamp,
                    voiceId: voiceId,
                    userEmail: currentUser.email
                });
            }
        });
    }
};

// پردازش و ذخیره‌سازی صدای ضبط شده
async function processRecording(audioBlob) {
    console.log('Processing new recording');
    const voiceId = generateVoiceId();
    console.log('Generated voice ID:', voiceId);

    // ذخیره در دیتابیس
    await db.voices.add({
        voiceId,
        blob: audioBlob,
        timestamp: Date.now(),
        roomCode: currentRoom,
        userEmail: currentUser.email
    });
    console.log('Recording saved successfully');
}
// Load existing recordings
async function loadExistingRecordings() {
    console.log('Loading existing recordings from database');
    const recordingsDiv = document.getElementById('recordings');
    recordingsDiv.innerHTML = '';
   
    const recordings = await db.voices
        .where('roomCode')
        .equals(currentRoom)
        .toArray();
    console.log('Found recordings:', recordings.length);

    const displayedVoices = new Set();

    recordings
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(recording => {
            if (!displayedVoices.has(recording.voiceId)) {
                displayedVoices.add(recording.voiceId);
                displayRecording(
                    URL.createObjectURL(recording.blob),
                    recording.userEmail !== currentUser.email,
                    recording.timestamp,
                    recording.voiceId,
                    recording.userEmail
                );
            }
        });
}
// Display recording with unique ID
function displayRecording(audioUrl, isRemote, timestamp, voiceId, userEmail) {
    if (document.querySelector(`[data-voice-id="${voiceId}"]`)) {
        return;
    }

    const recordingItem = document.createElement('div');
    recordingItem.className = 'recording-item';
    recordingItem.setAttribute('data-voice-id', voiceId);
   
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;

    const info = document.createElement('p');
    info.textContent = `${isRemote ? 'دریافتی از: ' : 'ضبط شده توسط: '}${userEmail}`;
   
    recordingItem.appendChild(audio);
    recordingItem.appendChild(info);
    document.getElementById('recordings').insertBefore(recordingItem, document.getElementById('recordings').firstChild);
}

class VoiceManager {
    constructor() {
        console.log('Voice Manager initialized');
        this.mediaRecorder = null;
        this.audioChunks = [];
    }

    startRecording() {
        console.log('Starting voice recording');
        // کد موجود
    }

    stopRecording() {
        console.log('Stopping voice recording');
        // کد موجود
    }
}

// شروع ضبط صدا و تنظیم پارامترها
const startRecording = async () => {
    console.log('Initializing audio recording');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Audio stream obtained');
    
    mediaRecorder = new MediaRecorder(stream);
    console.log('MediaRecorder configured');
};

// پردازش و ارسال صدای ضبط شده
const processAndSendRecording = async (audioBlob) => {
    console.log('Processing recorded audio');
    const voiceId = generateVoiceId();
    console.log('Voice ID generated:', voiceId);

    // ارسال به سایر کاربران
    connections.forEach(conn => {
        if (conn.open) {
            console.log('Sending audio to peer:', conn.peer);
            conn.send({
                type: 'audio',
                audioData: audioBlob,
                voiceId: voiceId
            });
        }
    });
};

// مدیریت بافر صوتی و کنترل کیفیت
function manageAudioBuffer() {
    console.log('Managing audio buffer');
    const bufferStats = {
        chunks: audioChunks.length,
        totalSize: audioChunks.reduce((size, chunk) => size + chunk.size, 0)
    };
    console.log('Buffer statistics:', bufferStats);
}

// پردازش و ذخیره‌سازی صدای دریافتی
async function processIncomingAudio(audioData, senderId) {
    console.log('Processing incoming audio from:', senderId);
    const timestamp = Date.now();
    
    await db.voices.add({
        voiceId: generateVoiceId(),
        blob: new Blob([audioData], { type: 'audio/webm' }),
        timestamp: timestamp,
        sender: senderId
    });
    console.log('Audio processed and saved');
}
