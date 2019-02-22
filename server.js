const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public' ));
mongoose.connect('mongodb://localhost/authors', { useNewUrlParser: true });

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [3, "Author name needs to be at least 3 characters."]
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Author = mongoose.model('Author', AuthorSchema);

// GET: Retrieve all Authors
app.get('/authors', function(req, res){
    Author.find({}, function(err, authors){
        if(err){
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
           res.json({message: 'All Authors:', data: authors})
        }
     }).sort({'name':1});
});

// GET: Retrieve a Task by ID

app.get('/authors/:id', function(req, res){
    Author.findOne({ _id: req.params.id }, function(err, author){
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            res.json({message: 'Author:', data: author})
        }
    });
});

// POST: Create a Task
app.post('/authors', function(req, res){
    var newAuthor = new Author();
    newAuthor.name = req.body.name;
    newAuthor.save(function(err, author){
        if (err) {
            const errors=[]
            const errorObj = err['errors']
            for (var errKey in errorObj){
                errors.push(errorObj[errKey]['message'])
            }
            res.json({message: 'Error', error: errors})
        } else {
            res.json({message: 'New Author:', data: author})
        }
    });
});

// PUT: Update a Task by ID
app.put('/authors/:id', function(req, res){
    Author.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name}, {runValidators: true}, function (err, author) {
        if (err) {
            const errors=[]
            const errorObj = err['errors']
            for (var errKey in errorObj){
                errors.push(errorObj[errKey]['message'])
            }
            res.json({message: 'Error', error: errors})
        } else {
            res.json({message: 'Updated Author:', data: author})
        }
    });
});

// DELETE: Delete a Task by ID
app.delete('/authors/:id/', function(req, res){
    Author.remove({ _id: req.params.id }, function(err){
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            Author.find({}, function(err, authors){
                if(err){
                    console.log('*********************');
                    console.log('Returned Error: ', err);
                    res.json({message: 'Error', error: err})
                }
                else {
                   res.json({message: 'Deletion Successful:', data: authors})
                }
            });
        }
    });
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

app.listen(8000, function () {
    console.log('listening on port 8000');
});