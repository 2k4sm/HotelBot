import express from 'express';
import db from './config/dbconn';
import router from './routes/chat.routes';

const app = express();
app.use(express.json())

let chatRouter = router;
app.use('/chat', chatRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});