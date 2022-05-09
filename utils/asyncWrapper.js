const AppError = require("./appError");
const winston = require("winston");

/**
 * Higher order fn that returns a middleware wrapped in try/catch
 * 
 */
module.exports.asyncMiddleware = (asyncMw) => 
  async (req, res, next) => {
    try {
      await asyncMw(req, res, next);
    } 
    catch (error) {
      winston.error(error.message, error);

      next(new AppError(error));
    }
  };

/**
 * Higher order fn that returns an async fn wrapped in try/catch
 * -- Assumes next is last arg passed --
 */
module.exports.wrapAsync = (asyncFn) => 
  async (...args) => {
    try {
      return await asyncFn(...args);
    } 
    catch (error) {
      winston.error(error.message, error);

      const next = args[args.length - 1];
      next(new AppError(error));
    }
  }
