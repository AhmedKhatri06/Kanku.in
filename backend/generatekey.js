const crypto = require('crypto');
console.log('Your ADMIN_SECRET_KEY:');
console.log(crypto.randomBytes(64).toString('hex'));