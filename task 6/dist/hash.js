const bcrypt = require('bcryptjs');

const password1 = '123456';
const password2 = 'password123';

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function comparePasswords(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// Example usage
(async () => {
  const hashe1 = await hashPassword(password1);
  console.log(`Hashed Password 1: ${password1}: ${hashe1}`); 

  const hashe2 = await hashPassword(password2);
  console.log(`Hashed Password 2: ${password2}: ${hashe2}`);

    const isMatch1 = await comparePasswords(password1, hashe1);
    console.log(`Does "${password1}" match its hash? ${isMatch1}`);

    const isMatch2 = await comparePasswords(password2, hashe2);
    console.log(`Does "${password2}" match its hash? ${isMatch2}`);
})
