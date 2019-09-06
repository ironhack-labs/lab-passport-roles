document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');
}, false);
​
​
function showPassword() {
  const passwordInput = document.getElementById('password');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
}
​