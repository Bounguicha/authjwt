const mongoose = require("mongoose");
const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true}, (res) => {
        if (res) {
                console.log('error =', res);
        }
        console.log('connected to database');
});
