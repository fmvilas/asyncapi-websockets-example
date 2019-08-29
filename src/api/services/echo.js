const Ajv = require('ajv');
const asyncapi = require('../../lib/asyncapi');
const service = module.exports = {};

const ajv = Ajv({
  allErrors: true,
});

/**
 *
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.message The message to send.
 */
service.sendEcho = async (ws, { message }) => {
  ws.send(message);
};
/**
 *
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {string} options.message The received message.
 */
service.onEcho = async (ws, options) => {
  const doc = asyncapi.get();
  const channel = doc.channel(options.path);
  const binding = channel && channel.binding('ws') ? channel.binding('ws') : undefined;
  const queryDefinition = binding && binding.query && binding.query.properties ? binding.query : undefined;
  const timesDefinition = queryDefinition.properties.times;
  let times = 1;

  if (options.query && options.query.times !== undefined && timesDefinition) {
    const valid = ajv.validate(timesDefinition, options.query.times);
    if (!valid) console.error(ajv.errors);
    times = options.query.times;
  }

  for (let i=0; i < times; i++) {
    service.sendEcho(ws, options);
  }
};
