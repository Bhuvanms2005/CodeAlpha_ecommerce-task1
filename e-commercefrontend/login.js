document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageElement.textContent = '';

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = "Login successful! Redirecting...";
                messageElement.style.color = 'green';
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } else {
                messageElement.textContent = result.msg || 'Invalid email or password.';
                messageElement.style.color = 'red';
                console.error("Login error:", result.msg);
            }
        } catch (error) {
            messageElement.textContent = 'Could not connect to the server. Please try again.';
            messageElement.style.color = 'red';
            console.error("Error during login:", error);
        }
    });
});