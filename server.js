
require ('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const clients = require('restify-clients');
const TRNSPRT_API = 'https://transportapi.com/'
const TRNSPRT_PARAMS = '?app_id=' + process.env.TRANSPORT_API_ID + '&app_key=' + process.env.TRANSPORT_API_KEY + '&train_status=passenger';
const client = clients.createJsonClient({
  url: TRNSPRT_API
});
app.use(express.static(path.join(__dirname, 'public')));

app.get ('/?index', (req,res,next)=>{
  res.sendFile(path.join(__dirname, '/index.html'));
});

//TRAIN STUFF
app.get ('/API/train/:station', (req,res,next)=>{
  const dateTime = new Date().toISOString().split('T');
    const date = dateTime[0];
    const time = dateTime[1].substring(0, 5);

  const url = '/v3/uk/train/station/' + req.params.station + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
    res.json(trainFormat(obj));
  });
});

app.get('/API/train/:station/:date', (req,res,next) => {
  const date = req.params.date;
  const dateTime = new Date().toISOString().split('T');

    const time = dateTime[1].substring(0, 5);


  const url = '/v3/uk/train/station/' + req.params.station + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
  res.json(trainFormat(obj));
  });
});

app.get('/API/train/:station/:date/:time', (req,res,next) => {
  const date = req.params.date;
  const time = req.params.time;

  const url = '/v3/uk/train/station/' + req.params.station + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
  res.json(trainFormat(obj));
  });
});


//BUS STUFF

app.get ('/API/bus/:stop', (req,res,next)=>{
  const dateTime = new Date().toISOString().split('T');
    const date = dateTime[0];
    const time = dateTime[1].substring(0, 5);

  const url = '/v3/uk/bus/stop/' + req.params.stop + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
    res.json(busFormat(obj));
  });
});

app.get('/API/bus/:stop/:date', (req,res,next) => {
  const date = req.params.date;
  const dateTime = new Date().toISOString().split('T');

    const time = dateTime[1].substring(0, 5);


  const url = '/v3/uk/bus/stop/' + req.params.stop + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
      res.json(busFormat(obj));
  });
});

app.get('/API/bus/:stop/:date/:time', (req,res,next) => {
  const date = req.params.date;
  const time = req.params.time;

  const url = '/v3/uk/bus/stop/' + req.params.stop + '/' + date + '/' + time  + '/timetable.json' + TRNSPRT_PARAMS;
  client.get(url, (err, req, resp, obj) => {
    if(err){
      console.log(err)
    }
    res.json(busFormat(obj));
  });
});

app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

app.get("/",function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/bus",function(req,res){
  res.sendFile(path.join(__dirname + '/public' +'/bus.html'));
});

app.get("/train",function(req,res){
  res.sendFile(path.join(__dirname + '/public' +'/train.html'));
});

app.get("/taxi",function(req,res){
  res.sendFile(path.join(__dirname + '/public' +'/taxi.html'));
});

app.use(express.static(__dirname + '/public'));
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

function trainFormat(train){
  const trainResults = train.departures.all.map((t, i) => {
    return ({
      platform: t.platform,
      operator: t.operator,
      aimed_departure_time: t.aimed_departure_time,
      operator_name: t.operator_name,
      platform: t.platform,
      origin_name: t.origin_name,
      destination_name: t.destination_name

    })
  });
  return trainResults;
}

function busFormat(bus){
      const busResults = Object.entries(bus.departures)
          .map(([key, value]) => value)
          .reduce((acc, cur) => acc.concat(cur), []);
      const formattedResults = busResults.map((b) => {
        return ({
          operator: b.operator,
          operator_name: b.operator_name,
          direction: b.direction,
          aimed_departure_time: b.aimed_departure_time,
          line: b.line,
          dir: b.dir
        })

      });
      return formattedResults;

}

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
