import { DataManager } from '../utils/DataManager.js';
import { SleepPillar } from './pillars/SleepPillar.js';
import { MovePillar } from './pillars/MovePillar.js';
import { EatPillar } from './pillars/EatPillar.js';
import { ConnectPillar } from './pillars/ConnectPillar.js';
import { ProgressArc } from '../utils/ProgressArc.js';

export function renderDashboard({ user, onLogout }) {
    const template = `
        <div class="dashboard">
            <header class="dashboard-header">
                <div class="user-info">
                    <h1>Welcome, ${user.name}</h1>
                </div>
                <div class="menu-container">
                    <button class="menu-button">Menu ▾</button>
                    <div class="menu-dropdown">
                        <a href="#account">Account</a>
                        <a href="#coaching">Coaching</a>
                        <a href="#labs">Labs</a>
                        <a href="#more">More</a>
                        <button id="logoutButton">Logout</button>
                    </div>
                </div>
            </header>

            <div class="pillars-grid">
                <div class="pillar" data-pillar="sleep">
                    <h3>Sleep</h3>
                    <div class="pillar-progress" id="sleep-progress"></div>
                    <p>7.5 hours avg</p>
                    <button class="details-button">View Details</button>
                </div>

                <div class="pillar" data-pillar="move">
                    <h3>Move</h3>
                    <div class="pillar-progress" id="move-progress"></div>
                    <p>8,000 steps</p>
                    <button class="details-button">View Details</button>
                </div>

                <div class="pillar" data-pillar="eat">
                    <h3>Eat</h3>
                    <div class="pillar-progress" id="eat-progress"></div>
                    <p>Daily goals met</p>
                    <button class="details-button">View Details</button>
                </div>

                <div class="pillar" data-pillar="connect">
                    <h3>Connect</h3>
                    <div class="pillar-progress" id="connect-progress"></div>
                    <p>2 activities</p>
                    <button class="details-button">View Details</button>
                </div>
            </div>

            <div class="pillar-detail-view"></div>
        </div>
    `;

    document.getElementById('app').innerHTML = template;

    // Initialize pillar components
    const pillars = {
        sleep: new SleepPillar(),
        move: new MovePillar(),
        eat: new EatPillar(),
        connect: new ConnectPillar()
    };

    // Initialize progress arcs
    const healthData = DataManager.getHealthData();
    const progressArcs = {
        sleep: new ProgressArc(document.getElementById('sleep-progress'), {
            foregroundColor: '#34c759',
            size: 120
        }),
        move: new ProgressArc(document.getElementById('move-progress'), {
            foregroundColor: '#4a90e2',
            size: 120
        }),
        eat: new ProgressArc(document.getElementById('eat-progress'), {
            foregroundColor: '#ff9500',
            size: 120
        }),
        connect: new ProgressArc(document.getElementById('connect-progress'), {
            foregroundColor: '#af52de',
            size: 120
        })
    };

    // Render progress arcs with animation
    Object.entries(progressArcs).forEach(([key, arc]) => {
        arc.render(healthData[key].score);
    });

    // Add event listeners
    document.getElementById('logoutButton').addEventListener('click', onLogout);

    // Menu toggle
    const menuButton = document.querySelector('.menu-button');
    const menuDropdown = document.querySelector('.menu-dropdown');
    menuButton.addEventListener('click', () => {
        menuDropdown.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.menu-button') && !e.target.matches('.menu-dropdown')) {
            menuDropdown.classList.remove('show');
        }
    });

    // Pillar detail view handlers
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const pillarType = e.target.closest('.pillar').dataset.pillar;
            const detailView = document.querySelector('.pillar-detail-view');
            
            // Render pillar detail view
            if (pillars[pillarType]) {
                pillars[pillarType][`render${pillarType.charAt(0).toUpperCase() + pillarType.slice(1)}Details`]();
            }
        });
    });
} 