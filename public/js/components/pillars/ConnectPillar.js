import { DataManager } from '../../utils/DataManager.js';

export class ConnectPillar {
    constructor() {
        this.interactions = {
            family: [
                { id: 'family_meal', name: 'Family Meal', duration: 30 },
                { id: 'family_activity', name: 'Family Activity', duration: 60 },
                { id: 'family_call', name: 'Family Call', duration: 15 }
            ],
            friends: [
                { id: 'friend_meetup', name: 'Friend Meetup', duration: 60 },
                { id: 'friend_call', name: 'Friend Call', duration: 15 },
                { id: 'group_activity', name: 'Group Activity', duration: 45 }
            ],
            community: [
                { id: 'volunteer', name: 'Volunteer Work', duration: 120 },
                { id: 'community_event', name: 'Community Event', duration: 90 },
                { id: 'social_group', name: 'Social Group', duration: 60 }
            ]
        };
    }

    renderConnectDetails() {
        const template = `
            <div class="pillar-detail connect-detail">
                <h2>Social Connections</h2>
                <div class="interaction-tracker">
                    ${this.renderInteractionSections()}
                </div>
                <div class="daily-summary">
                    <h3>Today's Social Time</h3>
                    <div class="time-summary">
                        <div class="time-circle">
                            <span class="time-value">${this.calculateTotalTime()}</span>
                            <span class="time-label">minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.querySelector('.pillar-content');
        if (container) {
            container.innerHTML = template;
            this.addEventListeners();
        }
    }

    renderInteractionSections() {
        return Object.entries(this.interactions).map(([category, activities]) => `
            <div class="interaction-section">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div class="activity-list">
                    ${activities.map(activity => this.renderActivityItem(activity, category)).join('')}
                </div>
            </div>
        `).join('');
    }

    renderActivityItem(activity, category) {
        return `
            <div class="activity-item" data-id="${activity.id}" data-category="${category}">
                <label class="activity-label">
                    <input type="checkbox" class="activity-checkbox">
                    <span class="activity-name">${activity.name}</span>
                    <span class="activity-duration">${activity.duration} min</span>
                </label>
            </div>
        `;
    }

    calculateTotalTime() {
        let total = 0;
        Object.values(this.interactions).forEach(activities => {
            activities.forEach(activity => {
                const checkbox = document.querySelector(`[data-id="${activity.id}"] input`);
                if (checkbox && checkbox.checked) {
                    total += activity.duration;
                }
            });
        });
        return total;
    }

    addEventListeners() {
        document.querySelectorAll('.activity-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateProgress();
            });
        });
    }

    updateProgress() {
        const totalTime = this.calculateTotalTime();
        const score = Math.min(100, Math.round((totalTime / 120) * 100)); // Target: 2 hours of social time

        DataManager.updatePillarData('connect', {
            score,
            totalTime,
            activities: this.getCheckedActivities(),
            lastUpdated: new Date().toISOString()
        });

        // Update UI
        const timeValue = document.querySelector('.time-value');
        if (timeValue) {
            timeValue.textContent = totalTime;
        }
    }

    getCheckedActivities() {
        const checked = [];
        document.querySelectorAll('.activity-checkbox:checked').forEach(checkbox => {
            const item = checkbox.closest('.activity-item');
            checked.push({
                id: item.dataset.id,
                category: item.dataset.category
            });
        });
        return checked;
    }
} 