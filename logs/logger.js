const winston = require("winston");

module.exports = winston.add(new winston.transports.File({
  filename:"./exceptions.log",
  handleExceptions: true,
  handleRejections:true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
}));