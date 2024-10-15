const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { TezosToolkit } = require('@taquito/taquito');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/tezchain', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  portfolioValue: Number
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// API route to fetch user portfolio
app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// API route to update portfolio
app.post('/update-portfolio', async (req, res) => {
  const { userId, newValue } = req.body;

  await User.findByIdAndUpdate(userId, { portfolioValue: newValue });

  const Tezos = new TezosToolkit('https://mainnet.smartpy.io');
  const contract = await Tezos.contract.at('KT1....'); // Contract address
  await contract.methods.update_value(newValue).send();

  res.send('Portfolio updated on-chain');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
