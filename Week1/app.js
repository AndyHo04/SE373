const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const { strict } = require('assert');
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const methodOverride = require('method-override');
const gamesRouter = require('./routes/games');
const {engine} = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

//setup the templating engine
app.engine('hbs', engine({ 
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


if (!mongoURI) {
  console.error('MONGO_URI is not defined in environment variables.');
  process.exit(1);
}


app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

//setup passport authentication
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'Games'
  }),
  cookie: { httpOnly: true }
})
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

require('./auth/passport');

// Serve CSS files BEFORE routes 
app.use('/css', express.static(path.join(__dirname, 'public/css')));

const authRouter = require('./routes/auth');
app.use('/', authRouter);

//set up router - must come AFTER passport initialization
app.use('/', gamesRouter);

// Serve other static files from the public directory (AFTER routers so routes take priority)
app.use(express.static(path.join(__dirname, 'public')));

// //Basic get route
// app.get('/index', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   console.log('Index page accessed');
// });

// app.get('/secondpage', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'secondpage.html'));
// });

//Routes for data and data files
//json API route
app.get('/api/data', (req, res) => {
  res.json ({
    message:"Hello, this is your JSON data!",
    timestamp: new Date(),
    items: ["Node.js", "Express", "npm"]
  });
});

// Course route
app.get('/api/course', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'data.json'), "utf-8", (err, data) => {
    if (err) {
      console.error('Error reading course data:', err);
      res.status(500).send('Error reading course data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

////Routes connected to MongoDB can be added here////

  // const videogames = new mongoose.Schema({}, { strict: false});
  // const Games = mongoose.model('videogames', videogames);
  // app.get("/api/games",  async (req, res) => {
  //   const data = await Games.find({});
  //   console.log(data);
  //   res.json(data);
  // });

// app.get("/api/games/:game",  async (req, res) => {
//   console.log(req.params.game);
//   const ginfo = req.params.game;
//   const gameInfo = await Games.findOne({game: ginfo});
//   res.json(gameInfo);
// });

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}); 

