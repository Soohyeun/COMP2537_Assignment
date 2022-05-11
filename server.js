const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const https = require('https');

app.listen(process.env.PORT || 5002, function (err) {
    if (err)
        console.log(err);
})

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static('public')) // public 폴더 안에 있는 모든 파일을 보내줌

const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/timelineDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelines", timelineSchema);

app.get('/timeline', function (req, res) {
    console.log('inside site')
    timelineModel.find({}, function (err, timelines) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(timelines);
        }
        res.send(timelines);
    });
})


app.get('/profile/:id', function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    data = ""
    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)

            this_hp = data.stats.filter((obj1) => {
                return obj1.stat.name == "hp"
            }).map((obj2) => {
                return obj2.base_stat
            })

            this_type = data.types.map((obj3) => {
                return obj3.type.name
            })

            res.render("profile.ejs", {
                "img_src": data.sprites.other["official-artwork"].front_default,
                "id": req.params.id,
                "name": data.name,
                "HP": this_hp[0],
                "weight": data.weight,
                "height": data.height,
                "type": this_type,
            });
        })
    });

})