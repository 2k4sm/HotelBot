import express from 'express';
import db from './config/dbconn';
import router from './routes/chat.routes';
import cors from 'cors'


const app = express();

app.use(express.json())
app.use(cors())


let chatRouter = router;
app.use('/api', chatRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});