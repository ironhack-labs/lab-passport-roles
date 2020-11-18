document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');



}, false);

const addUser = () => {
  const parentDiv = document.getElementById('new-user')
  const form = document.createElement('form')
  form.classList.add('container', 'column', 'new-card', 'content-center')
  form.action = '/users'
  form.method = 'POST'
  form.innerHTML = 
  ` <label for="username">Username:</label>
    <input type="text" name="username" id="username" placeholder="Username" autofocus>
    <label for="name">Name:</label>
    <input type="name" name="name" id="name" placeholder="Name">
    <label for="role">Choose a ROLE</label>
    <select name="role" id="role">
        <option value="DEV">DEV</option>
        <option value="TA">TA</option>
        <option value="STUDENT">STUDENT</option>
        <option value="GUEST">BOSS</option>
    </select>
    <div class="center-hor">
    <button class="correct" type="submit">Add new user</button>
    </div>
    `
  parentDiv.appendChild(form)
}