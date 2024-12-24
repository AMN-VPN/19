class ProfileManager {
    constructor() {
        this.defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI2JkYmRiZCIvPjxwYXRoIGQ9Ik0xODAsMTgwYzAtNDQtNDAtODAtODAtODBzLTgwLDM2LTgwLDgwIiBmaWxsPSIjYmRiZGJkIi8+PC9zdmc+';
    }

    init() {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        document.getElementById('profileSection').style.display = 'flex';
        
        const displayName = localStorage.getItem('displayName') || userEmail.split('@')[0];
        const theme = localStorage.getItem('theme') || 'light';
        const audioQuality = localStorage.getItem('audioQuality') || 'high';
        const userAvatar = localStorage.getItem('userAvatar') || this.defaultAvatar;

        const elements = {
            userAvatar: document.getElementById('userAvatar'),
            profileEmail: document.getElementById('profileEmail'),
            profileName: document.getElementById('profileName'),
            displayNameInput: document.getElementById('displayNameInput'),
            themeSelect: document.getElementById('themeSelect'),
            audioQualitySelect: document.getElementById('audioQualitySelect')
        };

        if (elements.userAvatar) elements.userAvatar.src = userAvatar;
        if (elements.profileEmail) elements.profileEmail.textContent = userEmail;
        if (elements.profileName) elements.profileName.textContent = displayName;
        if (elements.displayNameInput) elements.displayNameInput.value = displayName;
        if (elements.themeSelect) elements.themeSelect.value = theme;
        if (elements.audioQualitySelect) elements.audioQualitySelect.value = audioQuality;

        this.bindEvents();
    }

    bindEvents() {
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        const backToMainBtn = document.getElementById('backToMainBtn');
        const themeSelect = document.getElementById('themeSelect');
        const openProfileBtn = document.getElementById('openProfileBtn');

        if (changeAvatarBtn) changeAvatarBtn.onclick = () => this.handleAvatarChange();
        if (saveProfileBtn) saveProfileBtn.onclick = () => this.saveProfileChanges();
        if (backToMainBtn) backToMainBtn.onclick = () => this.backToMain();
        if (themeSelect) themeSelect.onchange = (e) => this.handleThemeChange(e.target.value);
        if (openProfileBtn) {
            openProfileBtn.onclick = () => {
                document.getElementById('mainContent').style.display = 'none';
                document.getElementById('profileSection').style.display = 'flex';
            };
        }
    }

    handleAvatarChange() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const imageUrl = await this.processAndStoreImage(file);
                    document.getElementById('userAvatar').src = imageUrl;
                    localStorage.setItem('userAvatar', imageUrl);
                } catch (error) {
                    console.error('خطا در آپلود تصویر:', error);
                    alert('خطا در بارگذاری تصویر');
                }
            }
        };
        
        input.click();
    }

    async processAndStoreImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    saveProfileChanges() {
        const displayName = document.getElementById('displayNameInput').value;
        const theme = document.getElementById('themeSelect').value;
        const audioQuality = document.getElementById('audioQualitySelect').value;

        localStorage.setItem('displayName', displayName);
        localStorage.setItem('theme', theme);
        localStorage.setItem('audioQuality', audioQuality);

        document.getElementById('profileName').textContent = displayName;
        alert('تنظیمات با موفقیت ذخیره شد');
    }

    handleThemeChange(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }

    backToMain() {
        document.getElementById('profileSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
    window.profileManager.init();
});