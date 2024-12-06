import { DataManager } from '../../utils/DataManager.js';

export class MovePillar {
    constructor() {
        this.mockHealthData = {
            steps: 8432,
            activeCalories: 384,
            standHours: 10,
            exerciseMinutes: 45,
            heartRate: {
                current: 72,
                resting: 62,
                max: 156
            },
            workouts: [
                {
                    type: 'Walking',
                    duration: 32,
                    calories: 156,
                    time: '08:30 AM'
                },
                {
                    type: 'Strength',
                    duration: 45,
                    calories: 228,
                    time: '05:45 PM'
                }
            ]
        };
    }

    renderMoveDetails() {
        const template = `
            <div class="pillar-detail move-detail">
                <h2>Movement & Activity</h2>
                <div class="activity-rings">
                    <div class="metrics-grid">
                        <div class="metric">
                            <h3>Steps</h3>
                            <p class="value">${this.mockHealthData.steps.toLocaleString()}</p>
                            <p class="target">Goal: 10,000</p>
                        </div>
                        <div class="metric">
                            <h3>Active Minutes</h3>
                            <p class="value">${this.mockHealthData.exerciseMinutes}</p>
                            <p class="target">Goal: 60</p>
                        </div>
                        <div class="metric">
                            <h3>Stand Hours</h3>
                            <p class="value">${this.mockHealthData.standHours}</p>
                            <p class="target">Goal: 12</p>
                        </div>
                    </div>
                </div>
                
                <div class="workouts-section">
                    <h3>Today's Workouts</h3>
                    <div class="workout-list">
                        ${this.renderWorkouts()}
                    </div>
                </div>

                <div class="sync-status">
                    <p>Last synced: ${new Date().toLocaleTimeString()}</p>
                    <button onclick="this.mockSyncData()">Sync with Apple Health</button>
                </div>
            </div>
        `;

        const container = document.querySelector('.pillar-content');
        if (container) {
            container.innerHTML = template;
            this.initializeAnimations();
        }
    }

    renderWorkouts() {
        return this.mockHealthData.workouts.map(workout => `
            <div class="workout-item">
                <div class="workout-type">${workout.type}</div>
                <div class="workout-details">
                    <span>${workout.duration} min</span>
                    <span>${workout.calories} cal</span>
                    <span>${workout.time}</span>
                </div>
            </div>
        `).join('');
    }

    mockSyncData() {
        // Simulate data refresh
        const progress = this.calculateProgress();
        DataManager.updatePillarData('move', {
            score: progress,
            data: this.mockHealthData,
            lastSync: new Date().toISOString()
        });
        
        // Show sync animation
        const button = document.querySelector('.sync-status button');
        button.classList.add('syncing');
        setTimeout(() => {
            button.classList.remove('syncing');
            this.renderMoveDetails();
        }, 1500);
    }

    calculateProgress() {
        const stepsProgress = (this.mockHealthData.steps / 10000) * 100;
        const exerciseProgress = (this.mockHealthData.exerciseMinutes / 60) * 100;
        const standProgress = (this.mockHealthData.standHours / 12) * 100;
        
        return Math.round((stepsProgress + exerciseProgress + standProgress) / 3);
    }

    initializeAnimations() {
        // Add smooth progress animations
        const metrics = document.querySelectorAll('.metric');
        metrics.forEach(metric => {
            metric.classList.add('fade-in');
        });
    }
} 