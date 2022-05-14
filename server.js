const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const https = require('https');

app.listen(process.env.PORT || 5002, function (err) {
    if (err)
        console.log(err);
})

// req.body.~ 쓸 수 있게끔 (post)
const bodyparser = require("body-parser"); 
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static('public')) // public 폴더 안에 있는 모든 파일을 보내줌

const mongoose = require('mongoose');

//localhost쓰면 안됨 ㅠㅠ 127.0.0.1쓰기
// mongoose.connect("mongodb://127.0.0.1:27017/timelineDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connect("mongodb+srv://soo:soohyeun@cluster0.styn6.mongodb.net/COMP2537?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});



//timeline start
//참고로 collection명은 무조건 복수 s, 대문자 포함하면 안된다!
const timelineModel = mongoose.model("timelines", timelineSchema);

//timelines collection에 있는 데이터 가져오기
app.get('/timeline/getAllEvents', function (req, res) {
    console.log('inside site')
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

// update같은거 -> post랑 비슷한데 body parser를 쓰는데 그냥.. html에서 오는걸 post로 쓸라고 그냥 구분지어서 이번엔 걍 put쓴다
app.put('/timeline/insert', function (req, res) {
    timelineModel.create({
        'text': req.body.text,
        'time': req.body.time,
        'hits': req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Insertion is sucessful!");
    });
})


//update할껀데 update할때에는 put/post나 get쓰는데 이번에는 get을 써서 URL에서 id parameter 가져옴
// delete함
app.get('/timeline/delete/:id', function (req, res) {
    timelineModel.remove({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Remove request is successful!");
    });
})

// update. id를 param으로 받고 hit 숫자를 1 키워준다.
app.get('/timeline/increaseHits/:id', function (req, res) {
    timelineModel.updateOne({
        '_id': req.params.id
    }, {
        $inc: {hits: 1}
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})


// See profile start
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