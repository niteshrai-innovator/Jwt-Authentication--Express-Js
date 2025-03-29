require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = [
    {
        username: 'John',
        title: 'First Post',
        content: 'This is the content of the first post.'
    },
    {
        username: 'John',
        title: 'Second Post',
        content: 'This is the content of the john second post.'
    },
    {
        username: 'Jane',
        title: 'Second Post',
        content: 'This is the content of the second post.'
    }
];

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}
app.get('/posts', authenticateToken, function(req,res,next){
    res.json(posts.filter(post => post.username == req.user.name));
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});