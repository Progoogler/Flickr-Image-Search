// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "f567a67d3e96fe321a40cbffbb3af036",
      secret: "5743af502ec65c0a"
    };


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/imagesearch", function(req, res) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.search({
      text: req.query.search, 
      page: req.query.offset ? parseInt(req.query.offset) : 1,
      per_page: 10,
      content_type: 1,
    }, function(err, result) {
      var data = [];
      for (let i = 0; i < result['photos']['photo'].length; i++) {
        let photoObj = {};
        let obj = result['photos']['photo'][i];
        photoObj.url = 'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '.jpg';
        photoObj.title = obj.title;
        data.push(photoObj);
      }
      history.push(data);
      res.send(data);
    });
  });
})

app.get("/latest/imagesearch", function(req, res) {
  if (history.length === 0) {
    res.send(JSON.stringify({'result': 'no recent results found'}));
  } else {
    res.send(JSON.stringify(history[history.length - 1]));
  }
});

// Simple in-memory store
var history = [];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
