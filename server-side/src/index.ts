import express from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cros from 'cors'
import router from './routers';

const app = express();


app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cros({
    origin: process.env.PRODICTION? '': '*'
}))

dotenv.config();
app.use('/',  router)


app.listen(
    process.env.PORT, () => {
        console.log(`server running : http://${process.env.HOST}:${process.env.PORT}`)
    }
)

