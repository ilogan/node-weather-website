const request = require("request");

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoiaWxvZ2FuIiwiYSI6ImNqdjVkdTBkdjBuZzQzeW5tY2xsYzZkdDcifQ.9HMctwU5T85kp9SGcsOMew&limit=1`;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Unable to connect to location services");
    } else if (body.features.length === 0) {
      callback("Unable to find location. Try another search");
    } else {
      const { center, place_name } = body.features[0];
      callback(undefined, {
        latitude: center[1],
        longitude: center[0],
        location: place_name
      });
    }
  });
};

module.exports = geocode;
