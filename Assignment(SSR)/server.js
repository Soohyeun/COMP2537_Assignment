const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const https = require('https');
const fs = require("fs");
const crypto = require('crypto');

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


// Use the session middleware
var session = require('express-session')

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

//global middleware는 router 위에 놓아야한다. 최대한 위로 올려놓으세요
//app.use(function name) -> app.use는 middleware로 안에 function을 execute시켜준다.: global middleware, 여러개 써도됨 처음 온것부터 실행됨


//next(): 다음꺼 실행하라는건데 실행 후 다시 제자리로 돌아옴. next()다음에 다른 코드도 쓸 수 있음 근데 추천은 안하니까.. 그냥 마지막에 놓는게 좋다. 모든 이후의 작업을 다 끝내고 와야해서...

//res.send / res.redirect -> 이거는 한개만 있어야하는데 res.write 이거는 여러개 있어도 됨

const mongoose = require('mongoose');
const {
    addAbortSignal
} = require('stream');
const {
    ObjectId
} = require('mongodb');

//localhost쓰면 안됨 ㅠㅠ 127.0.0.1쓰기
// mongoose.connect("mongodb://127.0.0.1:27017/timelineDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


mongoose.connect("mongodb+srv://soo:soohyeun@cluster0.styn6.mongodb.net/COMP2537?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.get('/login', function (req, res) {
    let doc = fs.readFileSync('./public/login.html', "utf8");
    res.send(doc);
});

app.get('/signup', function (req, res) {
    let doc = fs.readFileSync('./public/signup.html', "utf8");
    res.send(doc);
});


// authentication start

const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    useremail: String,
    usersalt: String,
    usertype: String,
});

const usersModel = mongoose.model("users", usersSchema);

app.put('/api/signup', function (req, res) {
    usersModel.find({
        useremail: req.body.newEmail
    }, function (err, users) {
        if (users.length == 0) {
            const salt = crypto.randomBytes(128).toString('base64');
            const hashPassword = crypto
                .createHash('sha512')
                .update(req.body.newPassword + salt)
                .digest('hex');
            usersModel.create({
                username: req.body.newName,
                password: hashPassword,
                useremail: req.body.newEmail,
                usersalt: salt,
                usertype: "user"
            }, function (err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log(data);
                }
                res.send("Insertion is sucessful!");
            });
        } else {
            res.send(false)
        }
    })

})


app.get('/checkuser', function (req, res) {
    if (req.session.loggedIn) {
        res.send({
            userID: req.session.id,
            username: req.session.name,
            useremail: req.session.email,
            usertype: req.session.type
        })
    } else {
        res.send(false)
    }
})


app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.send({
                    "result": "Failed",
                    "msg": "Could not log out."
                })
            } else {
                res.send({
                    "result": "Succeeded",
                    "msg": "Successfully logged out."
                })
            }
        });
    }
});


app.post('/api/login', function (req, res) {
    var CurrentUserID = req.body.useremail;
    // CurrentUserPW = req.body.userpw;

    usersModel.find({
        useremail: CurrentUserID
    }, function (err, users) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(users)
            if (Object.keys(users).length == 0) {
                res.send('no user')
            } else {
                console.log(users)

                const CurrentUserPW = crypto
                    .createHash('sha512')
                    .update(req.body.userpw + users[0].usersalt)
                    .digest('hex');

                console.log(CurrentUserPW)
                if (users[0].password == CurrentUserPW) {
                    res.send('login')
                    req.session.loggedIn = true;
                    req.session.userid = users[0]._id;
                    req.session.name = users[0].username;
                    req.session.email = users[0].useremail;
                    req.session.type = users[0].usertype;
                    req.session.save(function (err) {});
                    console.log(req.session.loggedIn)
                    console.log(req.session.userid)
                } else {
                    res.send('incorrect password')
                }
            }
        }
    });
})

//admin page
app.put('/signupbyadmin', function (req, res) {
    usersModel.find({
        useremail: req.body.newEmail
    }, function (err, users) {
        if (users.length == 0) {
            const salt = crypto.randomBytes(128).toString('base64');
            const hashPassword = crypto
                .createHash('sha512')
                .update(req.body.newPassword + salt)
                .digest('hex');
            usersModel.create({
                username: req.body.newName,
                password: hashPassword,
                useremail: req.body.newEmail,
                usersalt: salt,
                usertype: req.body.newUserType
            }, function (err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log(data);
                }
                res.send("Insertion is sucessful!");
            });
        } else {
            res.send(false)
        }
    })

})

app.get('/usersinfo', function (req, res) {
    usersModel.find({
        usertype: 'user',
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.get('/adminsinfo', function (req, res) {
    usersModel.find({
        usertype: 'admin',
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

// Remove users
app.put('/deleteUser', function (req, res) {
    usersModel.remove({
        'useremail': req.body.userEmail
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Remove request is successful!");
    });
})

// Update users
app.put('/updateUser', function (req, res) {
    usersModel.updateOne({
        'useremail': req.body.userEmail
    }, {
        $set: {
            usertype: 'admin'
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Remove request is successful!");
    });
})

//timeline start
//참고로 collection명은 무조건 복수 s, 대문자 포함하면 안된다!
const timelineSchema = new mongoose.Schema({
    userid: String,
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelines", timelineSchema);

//timelines collection에 있는 데이터 가져오기
app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({
        userid: req.session.userid
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.put('/timeline/loginrecord', function (req, res) {
    timelineModel.create({
        'userid': req.session.userid,
        'text': `${req.session.name} ${req.body.text}`,
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

app.put('/timeline/logoutrecord', function (req, res) {
    timelineModel.create({
        'userid': req.session.userid,
        'text': `${req.session.name} ${req.body.text}`,
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

// update같은거 -> post랑 비슷한데 body parser를 쓰는데 그냥.. html에서 오는걸 post로 쓸라고 그냥 구분지어서 이번엔 걍 put쓴다
app.put('/timeline/insert', function (req, res) {
    timelineModel.create({
        'userid': req.session.userid,
        'text': req.session.name + req.body.text,
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
        $inc: {
            hits: 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})




// See pokemon profile start
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





// Use Orders collection (cart / order)

const ordersSchema = new mongoose.Schema({
    userid: String,
    itemname: String,
    itemimg: String,
    itemhp: Number,
    quantity: Number,
    status: String,
    time: String
});

const ordersModel = mongoose.model("orders", ordersSchema);



app.put('/addcart/insert', function (req, res) {
    if (req.session.loggedIn) {

        ordersModel.find({
            'userid': req.session.userid,
            'itemname': req.body.name,
            'status': 'cart'
        }, function (err, data) {
            if (data.length == 0) {
                ordersModel.create({
                    userid: req.session.userid,
                    itemname: req.body.name,
                    itemimg: req.body.img,
                    itemhp: req.body.hp,
                    quantity: '1',
                    status: 'cart',
                    time: 'none',
                }, function (err, data) {
                    if (err) {
                        console.log("Error " + err);
                    } else {
                        console.log(data);
                    }
                    res.send("Insertion is sucessful!");
                });
            } else {
                ordersModel.updateOne({
                    userid: req.session.userid,
                    status: 'cart',
                    itemname: req.body.name
                }, {
                    $inc: {
                        quantity: 1
                    }
                }, function (err, data) {
                    if (err) {
                        console.log("Error " + err);
                    } else {
                        console.log(data);
                    }
                    res.send("Update is sucessful!");
                })
            }
        })
    } else {
        res.send(false)
    }
})

app.get('/addcart/getcart', function (req, res) {
    ordersModel.find({
        userid: req.session.userid,
        status: 'cart'
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.get('/addcart/increaseQtt/:itemName', function (req, res) {
    ordersModel.updateOne({
        userid: req.session.userid,
        status: 'cart',
        itemname: req.params.itemName
    }, {
        $inc: {
            quantity: 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.get('/addcart/decreaseQtt/:itemName', function (req, res) {
    ordersModel.updateOne({
        userid: req.session.userid,
        status: 'cart',
        itemname: req.params.itemName
    }, {
        $inc: {
            quantity: -1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.get('/addcart/delete/:itemName', function (req, res) {
    ordersModel.remove({
        userid: req.session.userid,
        status: 'cart',
        itemname: req.params.itemName
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Remove request is successful!");
    });
})

app.put('/addcart/checkout', function (req, res) {
    ordersModel.updateMany({
        userid: req.session.userid,
        status: 'cart',
    }, {
        $set: {
            status: 'ordered',
            time: req.body.time
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})

app.get('/getorders', function (req, res) {
    ordersModel.find({
        userid: req.session.userid,
        status: 'ordered'
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})


// Use game collection

const gamesSchema = new mongoose.Schema({
    userid: String,
    result: String,
    time: String
});

const gamesModel = mongoose.model("games", gamesSchema);

app.put('/saveGameResult', function (req, res) {
    gamesModel.create({
        'userid': req.session.userid,
        'result': req.body.result,
        'time': req.body.time
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send("Insertion is sucessful!");
    });
})

app.get('/loadGameResult', function (req, res) {
    gamesModel.find({
        userid: req.session.userid,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(data);
        }
        res.send(data);
    });
})