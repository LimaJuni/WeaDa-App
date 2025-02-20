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
    
    // Handle form submissions
    [signinForm, signupForm].forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your authentication logic here
            console.log('Form submitted:', form.id);
        });
    });
}); 