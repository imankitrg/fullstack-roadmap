const express = require('express');
const app = express()
const port = 8001

app.get('/', (req, res) => {
    res.status(200).json({ massage: "hello form auth service " })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})