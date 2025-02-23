document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    // Handle form switching
    document.querySelectorAll('.auth-switch a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const formToShow = link.getAttribute('data-form');
            
            if (formToShow === 'signin') {
                signinForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                signinForm.classList.remove('active');
            }
        });
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        
        try {
            const response = await fetch('assets/php/register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            alert(data.message);
            
            if (data.success) {
                signupForm.reset();
                // Switch to login form
                document.querySelector('[data-form="signin"]').click();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
    
    // Handle signin form submission
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signinForm);
        
        try {
            const response = await fetch('assets/php/login.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            alert(data.message);
            
            if (data.success) {
                // Redirect to main page
                window.location.href = 'main.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}); 