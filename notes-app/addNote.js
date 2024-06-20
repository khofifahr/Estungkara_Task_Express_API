const fetch = require('node-fetch');

fetch('http://localhost:3000/notes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Sample Note',
        datetime: '2024-06-19T14:00:00Z',
        note: 'This is a sample note.'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
