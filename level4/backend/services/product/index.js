const express = require('express');
const app = express()
const port = 8003

app.get('/', (req, res) => {
    res.status(200).json({ massage: "hello form product service " })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})