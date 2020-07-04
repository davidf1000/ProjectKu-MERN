const fetch = require("node-fetch");
const url ="https://api/github.com/users/davidf1000/repos?per_page=5&sort=created:asc&client_id=98996b519a2f72d18105&client_secret=abae3a46ec2d8ff347f5063fd5a3233ad1eb3853"
fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
        'user-agent':'node.js'
    }
  });
