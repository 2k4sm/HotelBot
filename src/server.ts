import express from 'express';

const app = express();

app.use(express.json());

app.get("/ping", (_, res) => {
    res.send("🏓 pong!");
});

app.listen(3000, () => {
    console.log('The magic happens on port 3000!');
});