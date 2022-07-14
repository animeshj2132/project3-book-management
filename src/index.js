const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const route = require("./routes/route")
const app = express();
const multer = require("multer")




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().any())


mongoose.connect("mongodb+srv://animesh:KNlVl9CDDcfmXfF0@cluster0.nrkqb.mongodb.net/group8Database", { useNewUrlParser: true })
     .then(() => console.log("MongoDb is connected"))
     .catch(error => console.log(error))

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
     console.log('Express app running on port' + (process.env.PORT || 3000))
});
