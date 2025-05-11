  const firebaseUrl = 'https://newproject-18291-default-rtdb.firebaseio.com/users.json';

 async function fetchUsers() {
    try {
      const res = await fetch(firebaseUrl);
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();

      const tbody = document.querySelector('#usersTable tbody');
      tbody.innerHTML = '';

      if (!data) throw new Error('No user data found');

      for (const key in data) {
        const { name, email } = data[key];
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${email}</td>`;
        tbody.appendChild(row);
      }

    } catch (err) {
      document.getElementById('errorMessage').textContent = 'Error: ' + err.message;
    }
  }
  window.onload = fetchUsers;