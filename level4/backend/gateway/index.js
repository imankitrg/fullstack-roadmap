const express = require('express');
const dotenv = require('dotenv');
const proxy = require('express-http-proxy');

dotenv.config()
const app = express()
const port = process.env.PORT || 8001

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({ massage: "hello form backend or gateway " })
})

app.use("/auth", proxy("http://localhost:8001"))
app.use("/order", proxy("http://localhost:8002"))
app.use("/product", proxy("http://localhost:8003"))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})