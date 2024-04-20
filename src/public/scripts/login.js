ocument.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const messageContainer = document.getElementById('messageContainer');
        if (data.message === "Login Successful") {
            messageContainer.classList.remove('alert-danger');
            messageContainer.classList.add('alert-success');
            // Optionally redirect or update the UI to show the user is logged in
            window.location.href = '/post'; // Redirect if needed
        } else {
            messageContainer.classList.remove('alert-success');
            messageContainer.classList.add('alert-danger');
        }
        messageContainer.textContent = data.message;
        messageContainer.style.display = 'block';
    })
    .catch(error => {
        console.error('Login Error:', error);
    });
});