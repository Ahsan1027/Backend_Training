const mongoose = require('mongoose');

const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected");
    })
    .catch(() => {
        console.log("no connection");
    })
