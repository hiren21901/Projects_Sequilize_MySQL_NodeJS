import { createServer, constants } from 'http2';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import app from './app.mjs';
import { mykhojDB, mktemDB } from './config/databaseConfig.mjs';

const Options = {
  key: fs.readFileSync(`${__dirname}/utils/certificates/private.key.pem`),
  cert: fs.readFileSync(`${__dirname}/utils/certificates/certificate.pem`)
};

// Check the database connections before starting the server
Promise.all([mykhojDB.authenticate(), mktemDB.authenticate()])
  .then(() => {
    let server;

    if (constants.NPN_ENABLED) {
      server = createServer(Options, app);
      console.log('HTTP/2 server created.');
    } else {
      server = http.createServer(Options, app);
      console.log('HTTPS server created using HTTP/1.1.');
    }

    server.on('request', (req, res) => {
      console.log(`Incoming ${req.method} request to ${req.url}`);
    });

    const PORT = process.env.PORT || 443;
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    const databaseName = error.original && error.original.address ? error.original.address : '';
    console.error(`Error connecting to the ${databaseName} database. Server cannot be started. Please check the database configuration.`);
  });
