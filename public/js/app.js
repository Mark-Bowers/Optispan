import { DataManager } from './utils/DataManager.js';
import { renderLogin } from './components/Login.js';
import { renderDashboard } from './components/Dashboard.js';

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.init();
    }

    init() {
        // Check if user is logged in
        const storedUser = DataManager.getUserData();
        if (storedUser?.isAuthenticated) {
            this.renderDashboard(storedUser);
        } else {
            this.renderLogin();
        }
    }

    renderLogin() {
        this.appElement.innerHTML = '';
        renderLogin({
            onLogin: (userData) => {
                DataManager.saveUserData(userData);
                this.renderDashboard(userData);
            }
        });
    }

    renderDashboard(user) {
        this.appElement.innerHTML = '';
        renderDashboard({
            user,
            onLogout: () => {
                DataManager.clearUserData();
                this.renderLogin();
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 