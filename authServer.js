require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let refreshTokens = [];
app.post('/login', (req, res) =>{
    // Authorization
    const username = req.body.username;
    const user = {name: username};

    const accessToken = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.post('/refresh-token', (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    
    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAuthToken({name:user.name});
        res.json({ accessToken: accessToken });
    });
});

app.delete('/logout', (req, res) => {
    // Logout
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.SECRET_REFRESH_TOKEN);
}
function generateAuthToken(user){
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '2m' });
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});