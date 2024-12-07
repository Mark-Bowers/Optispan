export class DataManager {
    static KEYS = {
        USER_DATA: 'optispan_user_data',
        HEALTH_DATA: 'optispan_health_data',
        SETTINGS: 'optispan_settings'
    };

    static getUserData() {
        try {
            const data = localStorage.getItem(this.KEYS.USER_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    static saveUserData(userData) {
        try {
            localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    static clearUserData() {
        localStorage.removeItem(this.KEYS.USER_DATA);
    }

    static getHealthData() {
        try {
            const data = localStorage.getItem(this.KEYS.HEALTH_DATA);
            return data ? JSON.parse(data) : this.getDefaultHealthData();
        } catch (error) {
            console.error('Error getting health data:', error);
            return this.getDefaultHealthData();
        }
    }

    static saveHealthData(data) {
        try {
            const existingData = this.getHealthData();
            const updatedData = {
                ...existingData,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.KEYS.HEALTH_DATA, JSON.stringify(updatedData));
            return true;
        } catch (error) {
            console.error('Error saving health data:', error);
            return false;
        }
    }

    static getDefaultHealthData() {
        return {
            eat: {
                score: 90,
                calories: 1800,
                meals: [],
                history: []
            },
            move: {
                score: 70,
                steps: 8000,
                activities: [],
                history: []
            },
            sleep: {
                score: 85,
                hours: 7.5,
                quality: 'good',
                history: []
            },
            connect: {
                score: 65,
                activities: 2,
                events: [],
                history: []
            },
            overallProgress: 75
        };
    }

    static updatePillarData(pillar, newData) {
        const healthData = this.getHealthData();
        healthData[pillar] = {
            ...healthData[pillar],
            ...newData,
            lastUpdated: new Date().toISOString()
        };
        
        // Update history
        healthData[pillar].history = [
            {
                date: new Date().toISOString(),
                ...newData
            },
            ...(healthData[pillar].history || []).slice(0, 29) // Keep last 30 days
        ];

        this.saveHealthData(healthData);
        this.updateOverallProgress(healthData);
    }

    static updateOverallProgress(healthData) {
        const pillars = ['eat', 'move', 'sleep', 'connect'];
        const overallProgress = pillars.reduce((acc, pillar) => {
            return acc + (healthData[pillar].score || 0);
        }, 0) / pillars.length;

        healthData.overallProgress = Math.round(overallProgress);
        this.saveHealthData(healthData);
    }
} 