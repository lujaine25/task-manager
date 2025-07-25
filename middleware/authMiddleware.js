require('dotenv').config();
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).send('Authorization required');
  }

  // Decode the Base64 credentials
  const base64Credentials = auth.split(' ')[1];
  const decoded = Buffer.from(base64Credentials, 'base64').toString();
  const [username, password] = decoded.split(':');

  if (username === process.env.USERNAME && password === process.env.PASSWORD)  {
    next(); // Let the request continue
  } else {
    res.status(403).send('Access denied');
  }
};

module.exports = basicAuth;
