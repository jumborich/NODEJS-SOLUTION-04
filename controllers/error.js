const winston = require('winston');

module.exports = (err, req, res, next) => {
  winston.error(err.message); // log errors to file

  const status = err.statusCode ? err.statusCode : 500;
  res.status(status).json({ status, error: err.message });
}