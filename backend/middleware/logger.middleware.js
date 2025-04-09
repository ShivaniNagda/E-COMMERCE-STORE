import fs from 'fs';
const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = `\n${new Date().toString()} - ${logData}`;
    await fsPromise.appendFile('log.txt', logData);
  } catch (err) {
    console.log(err);
  }
}

export const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes('login')) {
    const logData = `${req.method} ${req.url}`;
    await log(logData);
  }
  next();
};

export default loggerMiddleware;
