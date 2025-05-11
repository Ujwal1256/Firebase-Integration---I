  const dbUrl = 'https://newproject-18291-default-rtdb.firebaseio.com/users.json';

// Get DOM elements
const form = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

let editMode = false;
let currentEditId = null;

// Fetch and display users
async function fetchUsers() {
  try {
    const res = await fetch(dbUrl);
    if (!res.ok) throw new Error('Failed to fetch data');
    
    const data = await res.json();
    userTable.innerHTML = ''; 
    
    for (let id in data) {
      const user = data[id];
      const row = userTable.insertRow();
      row.setAttribute('id', id);  
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="openEdit('${id}', '${user.name}', '${user.email}')">Edit</button>
          <button class="delete-btn" onclick="deleteUser('${id}')">Delete</button>
        </td>
      `;
    }
  } catch (err) {
    message.textContent = '❌ ' + err.message;
    message.classList.add('error');
  }
}

// Open the Edit form
window.openEdit = function (id, name, email) {
  nameInput.value = name;
  emailInput.value = email;
  submitBtn.textContent = 'Update User';
  editMode = true;
  currentEditId = id;
  message.textContent = '';
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  if (!name || !email) {
    message.textContent = '❌ Please fill in both fields';
    message.classList.add('error');
    return;
  }

  const user = { name, email };
  
  try {
    let res;
    const url = editMode ? `https://newproject-18291-default-rtdb.firebaseio.com/users/${currentEditId}.json` : dbUrl;
    const method = editMode ? 'PATCH' : 'POST';

    res = await fetch(url, {
      method,
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Failed to save user');
    
    message.textContent = editMode ? '✅ User updated!' : '✅ User added!';
    message.classList.remove('error');
    form.reset();
    submitBtn.textContent = 'Add User';
    editMode = false;
    currentEditId = null;

    fetchUsers(); 
  } catch (err) {
    message.textContent = '❌ ' + err.message;
    message.classList.add('error');
  }
});

// Delete user
window.deleteUser = function (key) {
  fetch(`https://newproject-18291-default-rtdb.firebaseio.com/users/${key}.json`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(() => {
    console.log("User deleted successfully");

    document.getElementById(key).remove();
    message.textContent = '✅ User deleted!';
    message.classList.remove('error');
    message.classList.add('success');
  })
  .catch(error => {
    console.error("Error deleting user:", error);
    message.textContent = '❌ Error deleting user';
    message.classList.add('error');
  });
};

// Initial fetch of users
fetchUsers();
