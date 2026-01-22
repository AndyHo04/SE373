const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

//Read Route - Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}).sort({createdAt: -1}).lean();
    res.render('games/index', { games, successMessage: req.query.success });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create Route - Add a new game
router.post('/games', async (req, res) => {
  try {
    const payload = {
        title: req.body.title,
        platform: req.body.platform,
        genre: req.body.genre,
        rating: Number(req.body.rating),
        releaseYear: req.body.releaseYear? Number(req.body.releaseYear) : undefined
    }
    await Game.create(payload);
    res.redirect('/');
    } catch (err) {
        const games = await Game.find({}).sort({createdAt: -1}).lean();
        res.status(400).render ('games/index', { 
            games,
            errorMessage: 'Error creating game. Please ensure all fields are filled out correctly.',
            formData: req.body
        });
    }
});

//Update Route - Update a game
router.put('/games/:id', async (req, res) => {
  try {
    const payload = {
        ...req.body,
        rating: Number(req.body.rating),
        releaseYear: req.body.releaseYear? Number(req.body.releaseYear) : undefined
    }
    await Game.findByIdAndUpdate(req.params.id, payload, { runValidators: true });
    res.redirect('/');
  } catch (err) {
    const games = await Game.findById(req.params.id).lean();
    res.status(400).render ('games/index', {  
        games:{...games, ...req.body},
        errorMessage: 'Update Failed: Check required fields',
        formData: req.body
    });
  }
});

//edit page
router.get('/games/:id/edit',  async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).lean();
    if(!game) {
        return res.status(404).send('Game not found');
    }
    res.render('games/edit', { game });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete Route - Delete a game
router.delete('/games/:id', async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.redirect('/?success=Game deleted successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;