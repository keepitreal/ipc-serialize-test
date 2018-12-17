const BSON = require('BSON');
const v8 = require('v8');

exports.serialize = (payload, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(payload);
    case 'bson':
      return BSON.serialize(payload);
    case 'v8':
      return v8.serialize(payload);
    case 'raw':
    default:
      return payload;
  }
}

exports.deserialize = (payload, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(payload);
    case 'bson':
      return BSON.deserialize(payload);
    case 'v8':
      return v8.deserialize(payload);
    case 'raw':
    default:
      return payload;
  }
}
