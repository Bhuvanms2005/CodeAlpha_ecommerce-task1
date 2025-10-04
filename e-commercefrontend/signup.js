document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageElement = document.getElementById('message');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = "Registered successfully! Redirecting...";
                messageElement.style.color = 'green'; 
            
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500); 

            } else {
                messageElement.textContent = result.msg || 'An error occurred.';
                messageElement.style.color = 'red'; 
                console.log("SignUp error:", result.msg);
            }
        } catch (error) {
            messageElement.textContent = 'Could not connect to the server. Please try again.';
            messageElement.style.color = 'red';
            console.error("Error during signup:", error);
        }
    });
});