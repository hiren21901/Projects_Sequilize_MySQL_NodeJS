import DataCleaner from "../middlewares/dataCleanerMiddleware.mjs"

const bodyParserMiddleware = (req, res, next) => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        req.body = JSON.parse(body);

        // Check if the body is an object
        if (typeof req.body === 'object' && !Array.isArray(req.body)) {
          DataCleaner.cleanObjectValues(req.body);
          next();
        } else {
          console.log('Invalid JSON data');
          return res.status(400).json('Invalid JSON data');
        }
      } catch (error) {
        console.log('Error parsing JSON:', error);
        return res.status(400).json('Invalid JSON data');
      }
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export default bodyParserMiddleware;