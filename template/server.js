const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 9000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const middleware = (req, res, next) => {
  const { headers } = req;

  if (! headers.hasOwnProperty('x-glue-invoke')) {
    return next();
  }

  const { 'x-glue-invoke': invoke } = headers;
  const isPublic = process.env.GLUE_PUBLIC === 'false' ? false : true;
  if (invoke !== 'client' || isPublic === true) {
    return next();
  }

  //
  // If GLUE_PUBLIC is set specifically to "false". This means that the function
  // is not publically exposed to client invoke calls.
  //
  // If it is set "true" or the env var does not exist, then it is assumed that
  // the function is available for client invoke calls.
  return res.status(401).json({
    status: false,
    message: 'Access denied'
  });
};

(async () => {
  const actionsPath = path.join(process.cwd(), '/actions');

  const files = glob.sync('**/*.@(js|ts)', {
    cwd: actionsPath,
    ignore: [
      '**/node_modules/**', // ignore node_modules directories
      '**/_*/**', // ignore files inside directories that start with _
      '**/_*' // ignore files that start with _
    ]
  });

  for (const file of files) {
    const { default: handler } = await import(path.join(actionsPath, file))
    // File path relative to the project root directory. Used for logging.
    const relativePath = path.relative(".", file)

    if (handler) {
      const route = `/${replaceSpecialChars(file.split("/")[0])}`

      try {
        app.post(route, handler)
      } catch (error) {
        console.warn(`Unable to load file ${relativePath} as a Serverless Function`)
        continue
      }

      console.log(`Loaded route ${route} from ${relativePath}`)
    } else {
      console.warn(`No default export at ${relativePath}`)
    }
  }
})();

app.listen(port, () => {
  console.log(`Action listening on port ${port}`)
});
