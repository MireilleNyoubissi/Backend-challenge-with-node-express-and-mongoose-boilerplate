let express = require("express");
let app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*Serve an HTML file*/
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

/*Serve static assets*/
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static(__dirname + "/public"));

/*serve a json on a specific route*/
// app.get("/json", (req, res) => {
//     res.json(
//         {"message": "Hello json"}
//     );
// });


/*use the .env file to configure the app*/
app.get("/json", (req, res)=> {
    if(process.env.MESSAGE_STYLE === "uppercase") {
        res.json(
            { "message": "HELLO JSON" }
        )
    } else {
        res.json({ "message": "Hello json" });
    }
})

/*Mount the logger middleware*/
app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});
/*Chaining middleware. A time server*/ 

const middleware = (req, res, next) => {
    req.time = new Date().toString();
    next();
};

app.get("/now",middleware, (req, res) => {
    res.send({ time: req.time })
});

/*Get input from client. Route parameter*/

app.get("/:word/echo", (req, res) => {
    const { word } = req.params;
    res.json(
        { echo: word }
    )
})

/* Get input from client. Query parameter*/

app.get("/name", (req, res) => {
    const { first: firstName, last: lastName } = req.query;
    res.json({
       name: `${firstName} ${lastName}` 
    })
});

/*Get data from post */

app.post("/name", (req, res) => {
    const { first: firstName, last: lastName } = req.body;
    res.json({
      name: `${firstName} ${lastName}`
    });
}); 




 module.exports = app;