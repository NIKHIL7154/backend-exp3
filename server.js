const express = require('express');
const bodyParser=require("body-parser")
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const USERS_FILE = './users.json';

let users = [];
if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE);
    users = JSON.parse(data);
}


function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});


app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Username and password are required.');
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.send('Username already exists.');
    }

    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    saveUsers();

    res.redirect("http://localhost:3000/dashboard?username="+username)
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.send('Invalid username or password.');
    }

    res.redirect("http://localhost:3000/dashboard?username="+username)
});


app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


app.post('/dashboard', (req, res) => {
    const { id, username, password } = req.body;

    const userIndex = users.findIndex(user => user.id == id);
    if (userIndex === -1) {
        return res.send('User not found.');
    }

    users[userIndex].username = username;
    users[userIndex].password = password;
    saveUsers();

    res.redirect("http://localhost:3000/dashboard?username="+username)
});
app.post("/getuser",(req,res)=>{
    const user = users.find(user => user.username === req.query.username);
    res.json(user)
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
