const axios = require('axios');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const seed = req.query.seed;
  const details = req.query.details;

  if (!seed) {
    return res.render('pages/index', {
      data: false,
      details: details,
      seed: null,
    });
  }

  const seedApi = await axios.get(
    `https://script.google.com/macros/s/AKfycbzQwk5JI2-sqynOegsAldJd0USTSVHrJOg7u1MvW5rZfQyv4WO8QSNW93uNFDmMhaY/exec?seed=${seed}`
  );
  const seedTable = seedApi.data.result;
  seedTable.shift();

  const rolls1 = [];

  let next1;
  for (let i = 0; i < seedTable.length; i++) {
    const seed = seedTable[i];

    if (i % 2 === 0) {
      next1 = seed;
    } else {
      rolls1.push({
        seed1: next1,
        seed2: seed,
      });
    }
  }

  const character = require('./data/normal.json');

  for (const roll of rolls1) {
    roll.chara = character[roll.seed2 % 18];
    roll.score = `${String(roll.seed1).slice(-4)}, ${String(roll.seed2).slice(-2)}`;
  }

  for (let i = 0; i < rolls1.length; i++) {
    const result = rolls1[i];
    const prev = rolls1[i - 1];
    const next = rolls1[i + 1];

    if (i === 0) continue;

    if (result.chara === prev.chara) {
      const reCharacter = character.filter((chara) => chara !== result.chara);

      result.chara = `${result.chara} -> ${reCharacter[next.seed1 % 17]}`;
    }
  }

  seedTable.shift();

  const rolls2 = [];

  let next2;
  for (let i = 0; i < seedTable.length; i++) {
    const seed = seedTable[i];

    if (i % 2 === 0) {
      next2 = seed;
    } else {
      rolls2.push({
        seed1: next2,
        seed2: seed,
      });
    }
  }

  for (const roll of rolls2) {
    roll.chara = character[roll.seed2 % 18];
    roll.score = `${String(roll.seed1).slice(-4)}, ${String(roll.seed2) % 18}`;
  }

  for (let i = 0; i < rolls2.length; i++) {
    const result = rolls2[i];
    const prev = rolls2[i - 1];
    const next = rolls2[i + 1];

    if (i === 0) continue;

    if (result.chara === prev.chara) {
      const reCharacter = character.filter((chara) => chara !== result.chara);

      result.chara = `${result.chara} -> ${reCharacter[next.seed1 % 17]}`;
    }
  }

  res.render('pages/index', {
    data: true,
    details: details,
    seed: seed,
    url: req.url,
    resultA: rolls1,
    resultB: rolls2,
  });
});

app.listen(8080);
