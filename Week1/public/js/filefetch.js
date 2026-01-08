fetch('/api/course').then(response => response.json()).then(data => {
    console.log('Data received from /api/course:', data);

    document.getElementById('course').textContent = data.course;
    document.getElementById('instructor').textContent = data.instructor;
    document.getElementById('list').innerHTML = data.topics.map(item => `<li>${item}</li>`).join('');
}).catch(error => {
    console.error('Error fetching data:', error);
});