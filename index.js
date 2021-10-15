const axios = require('axios');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const seedApi = await axios.get(
    'https://script.google.com/macros/s/AKfycbzQwk5JI2-sqynOegsAldJd0USTSVHrJOg7u1MvW5rZfQyv4WO8QSNW93uNFDmMhaY/exec?seed=2812226865'
  );
  const seedTable = seedApi.data.result;
  seedTable.shift();

  const rolls = [];

  let next;
  for (let i = 0; i < seedTable.length; i++) {
    const seed = seedTable[i];

    if (i % 2 === 0) {
      next = seed;
    } else {
      rolls.push({
        seed1: next,
        seed2: seed,
      });
    }
  }

  const character = require('./data/normal.json');

  for (const roll of rolls) {
    roll.chara = character[roll.seed2 % 18];
  }

  console.log(rolls);

  for (let i = 0; i < rolls.length; i++) {
    const result = rolls[i];
    const prev = rolls[i - 1];
    const next = rolls[i + 1];

    if (i === 0) continue;

    if (result.chara === prev.chara) {
      result.chara = `${result.chara} -> ${character[next.seed1 % 18]}`;
    }
  }

  res.render('pages/index', {
    results: rolls,
  });
});

app.listen(8080);
