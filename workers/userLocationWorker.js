const _ = require('lodash');
const Account = require('../models/Account');
const CONFIG = require('../config/config');
const googleMapsClient = require('@google/maps').createClient({
  key: CONFIG[CONFIG.environment].GoogleMaps.key,
});

// Parse Google API results
const parseResults = place => {
  const addressComponents = {
    locality: 'long_name',
    postal_code: 'short_name',
  };

  const results = {};

  // Iterate through results and pull data we want
  _.forEach(place.address_components, addressComponent => {
    const type = addressComponent.types[0];

    if (_.has(addressComponents, type)) {
      results[type] = addressComponent[addressComponents[type]];
    }
  });

  return {
    city: results.locality,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  };
};

// Updates User's account location information from Zip Code
const userLocationWorker = (job, done) => {
  const data = job.data;
  const accountId = data.accountId;

  if (!accountId) {
    return done(new Error('Invalid Job'), null);
  }

  return Account.query()
    .where('id', accountId)
    .then(accounts => {
      if (accounts.length === 0) {
        done(new Error('Account not found'), null);
      }

      const account = accounts[0];
      const { zip } = account;

      googleMapsClient.geocode(
        {
          address: zip,
          components: {
            country: 'US',
          },
        },
        (err, response) => {
          if (err) {
            return done(err, null);
          }

          if (!response.json || !response.json.results.length) {
            return done(new Error('Location not found'), null);
          }

          // We always grab the first result, since is the most accurate
          const results = parseResults(response.json.results[0]);

          account.updateAttributes({
            city: results.city,
            latitude: results.latitude,
            longitude: results.longitude,
          });

          return account
            .save()
            .then(() => {
              done(null, account);
            })
            .catch(accountErr => {
              done(accountErr, null);
            });
        }
      );
    });
};

module.exports = userLocationWorker;
