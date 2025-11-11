// db.js
const users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

async function getUserById(id) {
  console.log('Fetching from database...');
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  return users.find(u => u.id === id) || null;
}

module.exports = { getUserById };
