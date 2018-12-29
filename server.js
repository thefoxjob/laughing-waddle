const proxy = require('cors-anywhere');

proxy.createServer().listen(8000, () => console.log(`Running CORS Anywhere on port 8000`));
