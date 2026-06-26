document.getElementById('signUpButton').addEventListener('click', function () {
    const emailInput = document.getElementById('emailInput').value;
    const messageDiv = document.getElementById('message');

    if (validateEmail(emailInput)) {
        messageDiv.textContent = 'Thank you for signing up!';
        messageDiv.style.color = 'green';
    } else {
        messageDiv.textContent = 'Please enter a valid email address.';
        messageDiv.style.color = 'red';
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
