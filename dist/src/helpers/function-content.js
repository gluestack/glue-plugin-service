"use strict";
exports.__esModule = true;
exports.functionContent = void 0;
exports.functionContent = "\nmodule.exports = (req, res, _next) => {\n  // do something with the headers & body\n  console.log({ headers: req.headers, body: req.body });\n\n  return res.status(200).json({ status: true, message: \"Hello World!\" });\n};\n";
//# sourceMappingURL=function-content.js.map