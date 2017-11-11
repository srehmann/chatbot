var Promise = require('bluebird');
var querystring = require('querystring');
var https = require('https');

var host = 'westus.api.cognitive.microsoft.com';
module.exports = {
    searchHotels: function (destination, checkInDate, checkOutDate) {
        return new Promise(function (resolve) {

            // Filling the hotels results manually just for demo purposes
            var hotels = [];
            for (var i = 1; i <= 5; i++) {
                hotels.push({
                    name: destination + ' Hotel ' + i,
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'https://placeholdit.imgix.net/~text?txtsize=35&txt=Hotel+' + i + '&w=500&h=260'
                });
            }

            hotels.sort(function (a, b) { return a.priceStarting - b.priceStarting; });

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(hotels); }, 1000);
        });
    },

    findKN: function performRequest(endpoint, method, data, success) {
        var dataString = JSON.stringify(data);
        console.log("data reached in method %s", dataString);
        var headers = {};
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString),
            "Ocp-Apim-Subscription-Key": "152d1d043d71401a9eee1d2692df32a2"
        };
        var options = {
            host: host,
            path: endpoint,
            method: method,
            headers: headers,
            json: data
        };
        var req = https.request(options, function (res) {
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                console.log(responseString);
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });
        console.log('string data passed: %s', dataString);
        req.write(dataString);
        req.end();
    }
};