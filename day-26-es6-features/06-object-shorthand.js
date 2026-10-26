// Day 26: shorten object properties and method definitions.
// Run: node 06-object-shorthand.js
// All values are made up. No account is accessed.

const username = 'test_user';
const password = 'test_pass';

const user1 = {
  username: username,
  password: password,
};

// When a property and variable share a name, write the name once.
const user2 = {
  username,
  password,
};

console.log(user1.username, user1.password);
console.log(user2.username, user2.password);

const user = {
  username: 'admin',

  // A method written with the function keyword.
  login: function () {
    return `${this.username} logged in`;
  },

  // Concise method syntax: no colon or function keyword is needed.
  logout() {
    return `${this.username} logged out`;
  },
};

console.log(user.login());
console.log(user.logout());
