import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimiter from 'express-rate-limit'
import RouteCreateTransaction from './Routes/CreateTransaction.js'
const server = express()
// change a line for .env update

server.use(helmet())


const allowedOrigins = ['https://solo-project-finance.vercel.app', 'http://localhost:5173'];


server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Optional: if you are using cookies or sessions
}));


server.use('/addtx', RouteCreateTransaction)

// env secret PORT is automatically defined by render
const PORT = process.env.PORT || 8080;
// like typescript union types but just states that fall back to second option if first failes/is unavailable
server.listen(PORT, () => {
  console.log(`The Server Is Running At Port ${PORT}`)
})