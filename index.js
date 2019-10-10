const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const alert = require('alert-node');

const app = express();
const studentSchema = new mongoose.Schema({
    id: String,
    pin: String,
    name: String,
    level: String,
    gender: String,
});
const Student = mongoose.model('Student', studentSchema);

const roomSchema = new mongoose.Schema({
    room: String,
    student1: String,
    student2: String,
    student3: String,
    student4: String,
})
const Room = mongoose.model('Room', roomSchema);

app.use(express.urlencoded({extended:true}));

const user = {
    studentID: undefined,
    pin: undefined,
}

app.use('/step2', (req, res, next) => {
    if(req.body.id == '' || req.body.pin == '')
        console.log('Not all fields filled in!');
    else
        next();
})

app.use('/step3', (req, res, next) => {
    if(req.body.name == '' || req.body.level == '' || req.body.gender == '' || req.body.room == '')
        console.log('Not all fields filled in!');
    else
        next();
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
})

app.post('/step2', (req,res) => {
    user.studentID = req.body.id;
    user.pin = req.body.pin;

    res.sendFile(path.join(__dirname + '/login2.html'));
})

app.post('/step3', async (req, res) => {
    var changed = 0;
    let room = await Room.findOneAndUpdate(
        {
            room: req.body.room,
            student1: ''
        },
        {
            student1: user.studentID
        },
        {
            new: true,
            runValidators: true,
        }
    )
    if(room != null)
        changed = 1;
    if(changed == 0) {
        let room = await Room.findOneAndUpdate(
            {
                room: req.body.room,
                student2: ''
            },
            {
                student2: user.studentID
            },
            {
                new: true,
                runValidators: true,
            }
        )
        if (room != null)
            changed = 1;
    }
    if (changed == 0) {
        let room = await Room.findOneAndUpdate(
            {
                room: req.body.room,
                student3: ''
            },
            {
                student3: user.studentID
            },
            {
                new: true,
                runValidators: true,
            }
        )
        if (room != null)
            changed = 1;
    }
    if (changed == 0) {
        let room = await Room.findOneAndUpdate(
            {
                room: req.body.room,
                student4: ''
            },
            {
                student4: user.studentID
            },
            {
                new: true,
                runValidators: true,
            }
        )
        if (room != null)
            changed = 1;
    }
    if (changed == 1) {
        const student = await Student.create({
            id: user.studentID,
            pin: user.pin,
            name: req.body.name,
            level: req.body.level,
            gender: req.body.gender
        })
        res.sendFile(path.join(__dirname + '/login3.html'));
    }
    else if (changed == 0)
        alert("This room is fully booked. Please select another room.")
})

mongoose.connect('mongodb://localhost:27017/cscd311-class-project-api', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(async () => {
    app.listen(3000, () =>
        console.log('App listening on port 3000'));
});