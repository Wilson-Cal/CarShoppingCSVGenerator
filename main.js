const fs = require('fs');
const d3 = require('d3-dsv');
const pMap = require('p-map');
const CarAPI = require('./src/apis/CarAPI');

const config = readConfig('./config.json');
const cars = readCars('./cars.json');

function readFile(filepath) {
    return fs.readFileSync(filepath);
}

function readConfig(filepath) {
    return JSON.parse(readFile(filepath));
}

function readCars(filepath) {
    return JSON.parse(readFile(filepath));
}

async function getCarDataAsync({ year, make, model }) {
    const { zipCode, radius } = config;
    let carResponse = await CarAPI.getNearbyCars(year, make, model, zipCode, radius);
    return JSON.parse(carResponse).listings;
}

function writeCSV(carData) {
    const now = Date.now();
    console.log(carData);
    fs.writeFileSync(`./output/cars_${now}.csv`, d3.csvFormat(carData));
}

function flattenData(carData) {
    let flattenedData = [];
    carData.forEach(data => {
        data.forEach(item => {
            flattenedData.push(item);
        });
    });
    return flattenedData;
}

async function main() {
    try {
        let carData = await pMap(cars, getCarDataAsync, { concurrency: 1 });
        carData = flattenData(carData);
        writeCSV(carData);
        console.log('CSV Written')
    } catch (err) {
        console.error(err);
    }
}

main();