const dbUrl = 'https://newproject-18291-default-rtdb.firebaseio.com/users.json';

const form = document.getElementById('userform');
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
    userTable.innerHTML = ''; // Clear the table before adding new rows
    
    for (let id in data) {
      const user = data[id];
      const row = userTable.insertRow();
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="openEdit('${id}', '${user.name}', '${user.email}')">Edit</button>
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

// Handle form submission (Add or Update)
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

    fetchUsers(); // Refresh user list
  } catch (err) {
    message.textContent = '❌ ' + err.message;
    message.classList.add('error');
  }
});

// Initial fetch of users
fetchUsers();
