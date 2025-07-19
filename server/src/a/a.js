const bcrypt = require('bcryptjs');

bcrypt.hash('admin@bhanu', 10).then(hash => {
  console.log('Hashed Password:', hash);
});