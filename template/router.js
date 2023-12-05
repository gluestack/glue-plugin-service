module.exports = () => [
  {
    "server_name": "api"
  },
  {
    "path": "/backend/services/(.*)",
    "proxy": {
      "instance": `services:9000`,
      "path": "/$1"
    }
  }
];
