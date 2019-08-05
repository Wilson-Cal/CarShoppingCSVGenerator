const request = require('request-promise-native');
const apiKey = require('../../auth.json').apiKey;
const baseURI = 'http://api.marketcheck.com/v1/';

const getNearbyCars = async (year, make, model, zipCode, radius = 100, newCars = false) => {
    let car_type = newCars ? 'new' : 'used';
    let uri = `${baseURI}search?api_key=${apiKey}&year=${year}&make=${make}&model=${model}&zip=${zipCode}&radius=${radius}&car_type=${car_type}&start=0&rows=50&sort_order=asc`
    return await request(uri, {
        headers: {
            "Host": 'marketcheck-prod.apigee.net',
            "Content-Type": 'application/json'
        }
    });
}

module.exports = {
    getNearbyCars
};