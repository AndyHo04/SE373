fetch('/api/data').then(response => response.json()).then(data => {
    console.log('Data received from /api/data:', data);

    document.getElementById('message').textContent = data.message;
    document.getElementById('time').textContent = new Date(data.timestamp).toLocaleString();
    document.getElementById('list').innerHTML = data.items.map(item => `<li>${item}</li>`).join('');
}).catch(error => {
    console.error('Error fetching data:', error);
});