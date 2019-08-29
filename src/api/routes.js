const util = require('util');
const { Router } = require('express');
const { yellow } = require('../lib/colors');
const echoService = require('./services/echo');
const router = Router();
module.exports = router;

router.ws('/echo', async (ws, req) => {
  ws.on('message', async (msg) => {
    const path = req.path.substr(0, req.path.length - '/.websocket'.length);
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await echoService.onEcho(ws, { message: msg, path, query: req.query });
  });
});
