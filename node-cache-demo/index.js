const express = require('express');
const app = express();
const NodeCache  = require('node-cache');

//const cache = new NodeCache({stdTTL: 10 });
const { getUserById } = require('./db');

const cache  = new Map();
const locks  = new Map();



async function getUserWithCache(id) {
  // Return if cached
  if (cache.has(id)) return cache.get(id);

  // If fetch is already in progress, wait for it
  if (locks.has(id)) {
    return await locks.get(id);
  }

  // Create a promise for this fetch
  const fetchPromise = (async () => {
    const user = await getUserById(id);
    if (user) cache.set(id, user); // store in cache
    locks.delete(id); // release lock
    return user;
  })();

  // Save promise in locks
  locks.set(id, fetchPromise);

  return await fetchPromise;
}



app.get('/user/:id', async(req, res)=> {
    const id = req.params.id;
    const user =  getUserWithCache(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
     
    res.json({
        source: cache.has(id) ? 'cache' : 'db',
        data: user
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));