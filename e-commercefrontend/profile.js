document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');

    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    async function fetchProfile() {
        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                nameInput.value = user.name;
                emailInput.value = user.email;
            } else {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Failed to fetch profile');
        }
    }

    function toggleEditMode(isEditing) {
        nameInput.disabled = !isEditing;
        emailInput.disabled = !isEditing;
        editBtn.classList.toggle('hidden', isEditing);
        saveBtn.classList.toggle('hidden', !isEditing);
    }

    editBtn.addEventListener('click', () => {
        toggleEditMode(true);
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedData = {
            name: nameInput.value,
            email: emailInput.value
        };

        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                showToast('Profile updated successfully!');
                toggleEditMode(false);
            } else {
                showToast('Failed to update profile.');
            }
        } catch (error) {
            showToast('Server error.');
        }
    });

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    await fetchProfile();
});