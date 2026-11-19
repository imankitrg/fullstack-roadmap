const express = require('express');
const dotenv = require('dotenv');
const proxy = require('express-http-proxy');

dotenv.config()
const app = express()
const port = process.env.PORT || 8001

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({ massage: `hello form ${process.env.SERVER_NAME}  ` })
})

app.use("/auth", proxy("http://auth-service:8001"))
app.use("/order", proxy("http://order-service:8002"))
app.use("/product", proxy("http://product-service:8003"))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})