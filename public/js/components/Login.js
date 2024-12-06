export function renderLogin({ onLogin }) {
    const template = `
        <div class="login-container">
            <div class="login-box">
                <h1>Optispan Copilot</h1>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter your password"
                            required
                        >
                    </div>
                    <div class="error-message" id="errorMessage"></div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('app').innerHTML = template;

    // Add event listeners
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        try {
            // For testing purposes, log the values
            console.log('Email:', email, 'Password:', password);
            
            // Update the email domain here
            if (email === 'demo@optispan.life' && password === 'password') {
                onLogin({
                    name: 'Demo User',
                    email: email,
                    isAuthenticated: true
                });
            } else {
                errorMessage.textContent = 'Invalid credentials';
            }
        } catch (err) {
            errorMessage.textContent = 'An error occurred during login';
        }
    });
} 