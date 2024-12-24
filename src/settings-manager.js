class SettingsManager {
    constructor() {
        this.currentPanel = null;
        this.initializeSettings();
        this.bindEvents();
    }

    initializeSettings() {
        const settings = {
            displayName: localStorage.getItem('displayName') || '',
            accountType: localStorage.getItem('accountType') || 'standard',
            chatBackground: localStorage.getItem('chatBackground') || 'light',
            audioQuality: localStorage.getItem('audioQuality') || 'high',
            onlineStatus: localStorage.getItem('onlineStatus') || 'everyone'
        };

        Object.keys(settings).forEach(key => {
            const element = document.getElementById(`${key}Input`) || 
                          document.getElementById(`${key}Select`);
            if (element) {
                element.value = settings[key];
            }
        });
    }

    bindEvents() {
        document.getElementById('accountSettings').onclick = () => {
            const mainContent = document.getElementById('mainContent');
            const settingsPanel = document.getElementById('accountSettingsPanel');
            const profileSection = document.getElementById('profileSection');

            mainContent.style.display = 'none';
            profileSection.style.display = 'none';
            settingsPanel.style.display = 'flex';
            settingsPanel.style.transform = 'translateX(0)';
            
            console.log('Account settings panel activated');
            
            // Load current settings
            this.loadAccountSettings();
        };

        // Back button handler
        document.querySelectorAll('.back-button').forEach(btn => {
            btn.onclick = () => {
                const settingsPanel = document.getElementById('accountSettingsPanel');
                const profileSection = document.getElementById('profileSection');
                
                settingsPanel.style.transform = 'translateX(100%)';
                settingsPanel.style.display = 'none';
                profileSection.style.display = 'flex';
                
                console.log('Returned to profile section');
            };
        });

        document.getElementById('saveAccountSettings').onclick = () => {
            const displayName = document.getElementById('displayNameInput').value;
            const accountType = document.getElementById('accountTypeSelect').value;
            
            localStorage.setItem('displayName', displayName);
            localStorage.setItem('accountType', accountType);
            
            document.getElementById('profileName').textContent = displayName;
            
            alert('تغییرات با موفقیت ذخیره شد');
            
            // برگشت به صفحه پروفایل
            const settingsPanel = document.getElementById('accountSettingsPanel');
            const profileSection = document.getElementById('profileSection');
            
            settingsPanel.style.transform = 'translateX(100%)';
            settingsPanel.style.display = 'none';
            profileSection.style.display = 'flex';
        };

        document.getElementById('backToMainChat').onclick = () => {
            document.getElementById('profileSection').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        };
    }
    loadAccountSettings() {
        const displayNameInput = document.getElementById('displayNameInput');
        const accountTypeSelect = document.getElementById('accountTypeSelect');
        
        if (displayNameInput) {
            displayNameInput.value = localStorage.getItem('displayName') || '';
        }
        
        if (accountTypeSelect) {
            accountTypeSelect.value = localStorage.getItem('accountType') || 'standard';
        }
        
        console.log('Account settings loaded successfully');
    }

    showChatSettings() {
        const panel = document.getElementById('chatSettingsPanel');
        if (panel) {
            panel.style.display = 'block';
            panel.classList.add('active');
            this.currentPanel = panel;
        }
    }

    showPrivacySettings() {
        const panel = document.getElementById('privacySettingsPanel');
        if (panel) {
            panel.style.display = 'block';
            panel.classList.add('active');
            this.currentPanel = panel;
        }
    }

    hideCurrentPanel() {
        if (this.currentPanel) {
            this.currentPanel.classList.remove('active');
            this.currentPanel.style.display = 'none';
            this.currentPanel = null;
        }
    }

    saveSetting(key, value) {
        localStorage.setItem(key, value);
        console.log(`Setting saved: ${key} = ${value}`);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});