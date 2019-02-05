const Sequelize = require('sequelize')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})
const express = require('express');
// my server
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const port = process.env.PORT || '4000';
// listens to this port
app.listen(port, () => `Listening on port ${port}`);

const House = sequelize.define('house', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
    tableName: 'houses'
  });
// this creates the houses table in your database when your app starts
House.sync();

// to GET all houses; listens to get requests
// callback function will be run when the request will be send
app.get('/houses', function (req, res, next) {
  House.findAll()
  // a callback function is invoked with houses as a parameter
    .then(houses => {
      res.json({ houses: houses })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

// to GET a single house
app.get('/houses/:id', function (req, res, next) {
  const id = req.params.id;
  House.findById(id)
    .then(house => {
      res.json({ house })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong, could not show the house',
        error: err
      })
    })
})

// to create a house
app.post('/houses', function (req, res) {
  House
    .create(req.body)
    .then(house => res.status(201).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong, could not create the house',
        error: err
      })
    })
})

/* app.post('/houses', function (req, res) {
  console.log('Incoming data: ', req.body)
  res.json({ message: 'Create a new house' })
})

House.create({
  title: 'Multi Million Estate',
  description: 'This was build by a super-duper rich programmer',
  size: 1235,
  price: 98400000
})
.then(house => console.log(`The house is now created. The ID = ${house.id}`)) */

// to update a house
app.put('/houses/:id', function (req, res) {
  const id = req.params.id
  House.findById(id)
    .then(house => {
      return house.update(req.body)
    })
    .then(house => console.log(`The house with ID ${house.id} is now updated`, house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong, could not update the house',
        error: err
      })
    })
})

// to delete
app.delete('/houses/:id', function (req, res) {
  const id = req.params.id
  House.destroy({
    where:{
      id: id
    }
  })
    .then(house => {
      res.status(200).json({ message: `The house is destroyed`})
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong, could not delete the house',
        error: err
      })
    })
})