import { DataManager } from '../../utils/DataManager.js';

export class SleepPillar {
    constructor() {
        this.healthKit = null;
        this.initHealthKit();
    }

    async initHealthKit() {
        if (window.AppleHealthKit) {
            const permissions = {
                permissions: {
                    read: ['Sleep', 'HeartRate'],
                    write: []
                }
            };

            window.AppleHealthKit.initHealthKit(permissions, (error) => {
                if (error) {
                    console.error('HealthKit initialization failed', error);
                } else {
                    this.healthKit = window.AppleHealthKit;
                    this.fetchSleepData();
                }
            });
        }
    }

    async fetchSleepData() {
        if (!this.healthKit) return;

        const options = {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
        };

        this.healthKit.getSleepSamples(options, (error, results) => {
            if (error) {
                console.error('Error getting sleep data:', error);
                return;
            }

            const sleepData = this.processSleepData(results);
            DataManager.updatePillarData('sleep', sleepData);
            this.renderSleepDetails();
        });
    }

    processSleepData(samples) {
        // Calculate total sleep time and quality metrics
        let totalSleepMinutes = 0;
        let deepSleepMinutes = 0;

        samples.forEach(sample => {
            const duration = (new Date(sample.endDate) - new Date(sample.startDate)) / 1000 / 60;
            totalSleepMinutes += duration;
            if (sample.value === 'ASLEEP') {
                deepSleepMinutes += duration;
            }
        });

        const hours = totalSleepMinutes / 60;
        const quality = (deepSleepMinutes / totalSleepMinutes) * 100;
        const score = this.calculateSleepScore(hours, quality);

        return {
            score,
            hours,
            quality: quality > 80 ? 'excellent' : quality > 60 ? 'good' : 'fair',
            lastSync: new Date().toISOString()
        };
    }

    calculateSleepScore(hours, quality) {
        // Score based on recommended 7-9 hours and sleep quality
        let score = 0;
        if (hours >= 7 && hours <= 9) {
            score += 50;
        } else if (hours >= 6 && hours <= 10) {
            score += 30;
        }
        score += (quality / 100) * 50;
        return Math.round(score);
    }

    renderSleepDetails() {
        const sleepData = DataManager.getHealthData().sleep;
        const template = `
            <div class="pillar-detail sleep-detail">
                <h2>Sleep Details</h2>
                <div class="metrics-grid">
                    <div class="metric">
                        <h3>Hours Slept</h3>
                        <p class="value">${sleepData.hours.toFixed(1)}</p>
                        <p class="target">Target: 7-9 hours</p>
                    </div>
                    <div class="metric">
                        <h3>Quality</h3>
                        <p class="value">${sleepData.quality}</p>
                        <p class="sync-time">Last synced: ${new Date(sleepData.lastSync).toLocaleTimeString()}</p>
                    </div>
                </div>
                <div class="sync-button">
                    <button onclick="this.fetchSleepData()">Sync with Apple Health</button>
                </div>
            </div>
        `;

        const container = document.querySelector('.pillar-content');
        if (container) {
            container.innerHTML = template;
        }
    }
} 