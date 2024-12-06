import { DataManager } from '../../utils/DataManager.js';

export class EatPillar {
    constructor() {
        this.dailyChecklist = {
            vegetables: [
                { id: 'leafy_greens', name: 'Leafy Greens', checked: false },
                { id: 'cruciferous', name: 'Cruciferous Vegetables', checked: false },
                { id: 'colorful_veggies', name: 'Colorful Vegetables', checked: false }
            ],
            protein: [
                { id: 'lean_protein', name: 'Lean Protein', checked: false },
                { id: 'fish', name: 'Fish/Omega-3', checked: false }
            ],
            supplements: [
                { id: 'multivitamin', name: 'Multivitamin', checked: false },
                { id: 'vitamin_d', name: 'Vitamin D', checked: false },
                { id: 'omega3', name: 'Omega-3', checked: false },
                { id: 'magnesium', name: 'Magnesium', checked: false }
            ]
        };
    }

    renderEatDetails() {
        const template = `
            <div class="pillar-detail eat-detail">
                <h2>Nutrition Tracker</h2>
                <div class="checklist-container">
                    <div class="checklist-section">
                        <h3>Vegetables</h3>
                        ${this.renderChecklist(this.dailyChecklist.vegetables)}
                    </div>
                    <div class="checklist-section">
                        <h3>Protein</h3>
                        ${this.renderChecklist(this.dailyChecklist.protein)}
                    </div>
                    <div class="checklist-section">
                        <h3>Supplements</h3>
                        ${this.renderChecklist(this.dailyChecklist.supplements)}
                    </div>
                </div>
                <div class="progress-summary">
                    <h3>Daily Progress</h3>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${this.calculateProgress()}%"></div>
                    </div>
                    <p>${this.calculateProgress()}% Complete</p>
                </div>
            </div>
        `;

        const container = document.querySelector('.pillar-content');
        if (container) {
            container.innerHTML = template;
            this.addEventListeners();
        }
    }

    renderChecklist(items) {
        return items.map(item => `
            <div class="checklist-item">
                <input type="checkbox" 
                    id="${item.id}" 
                    ${item.checked ? 'checked' : ''}
                    data-category="${item.category}"
                >
                <label for="${item.id}">${item.name}</label>
            </div>
        `).join('');
    }

    calculateProgress() {
        const allItems = [
            ...this.dailyChecklist.vegetables,
            ...this.dailyChecklist.protein,
            ...this.dailyChecklist.supplements
        ];
        const checkedCount = allItems.filter(item => item.checked).length;
        return Math.round((checkedCount / allItems.length) * 100);
    }

    addEventListeners() {
        document.querySelectorAll('.checklist-item input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateItemStatus(e.target.id, e.target.checked);
            });
        });
    }

    updateItemStatus(itemId, checked) {
        // Update the checklist data
        Object.values(this.dailyChecklist).forEach(category => {
            const item = category.find(i => i.id === itemId);
            if (item) {
                item.checked = checked;
            }
        });

        // Update progress in DataManager
        const progress = this.calculateProgress();
        DataManager.updatePillarData('eat', {
            score: progress,
            checklist: this.dailyChecklist,
            lastUpdated: new Date().toISOString()
        });

        // Update UI
        this.updateProgressDisplay(progress);
    }

    updateProgressDisplay(progress) {
        const progressBar = document.querySelector('.progress-bar .progress');
        const progressText = document.querySelector('.progress-summary p');
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        }
    }
} 