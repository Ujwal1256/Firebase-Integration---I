const form = document.getElementById('dataForm');
const message = document.getElementById('message');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  const newUser = { name, email };

  try {
    const res = await fetch('https://newproject-18291-default-rtdb.firebaseio.com/users.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    if (!res.ok) throw new Error('Failed to add user');

    message.textContent = '✅ User added successfully!';
    message.style.color = 'green';
    form.reset();
  } catch (err) {
    message.textContent = '❌ Error: ' + err.message;
    message.style.color = 'red';
  }
});
