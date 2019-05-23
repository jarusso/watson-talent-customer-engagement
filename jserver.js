var http = require("http");
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var assignees;

var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

var authToken = "token " + GITHUB_TOKEN;

app.use(express.static(__dirname + '/images/'));


// Running Server Details.
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});


// #1 ADD YOUR REPO FOR YOUR OWNER'S JSON FILE - see owners.json in this repo for structure required
request({
      "url":"OWNER.JSON-ADD YOURS HERE",
      "method":"GET",
      "headers": {"Authorization": authToken, "User-Agent": "node.js", 'Accept': 'application/vnd.github.VERSION.raw'},
      }, function(err, response, body) {
          console.log("Owners -> " + body);
          if (err) console.log(err);
          assignees = JSON.parse( body);
    });


console.log('This is after the loadAssignees call');  


app.get('/feedback.html', function (req, res) {
  fs.readFile("feedback.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

app.get('/', function (req, res) {
  fs.readFile("main.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

app.post('/thank', urlencodedParser, function (req, res){
  var theTitle = 'Issue from <' + req.body.name;
  theTitle += '> email: <' + req.body.email;
  theTitle += '> title: <' + req.body.title;
  theTitle += '> company: <' + req.body.company + '>';

  console.log( "posting to git");

  var labelArray;
  if ( validateEmail(req.body.email ))
  {
      labelArray = [req.body.category, req.body.email];
  }
  else
  {
      labelArray = [req.body.category];
  }
  console.log(" labelArray = " + labelArray);
  var theLabels = JSON.stringify(labelArray);
  console.log(" theLabels = " + theLabels);

  
  // create assignment
  
  var assigneeArray = [assignees[req.body.category]];
  var bAssignees = false;
  
  if (typeof assigneeArray !== 'undefined' && assigneeArray.length > 0) {
    // the array is defined and has at least one element
    bAssignees = true;
    console.log("We have assignees");
  }
  
  // #2 ADD YOUR REPO FOR WHERE YOU WISH TO CAPTURE ISSUES
  
  {
      request({
          "url":"ADD YOUR GITHUB REPO FOR ISSUES HERE",
          "method":"POST",
          "headers": {"Authorization": authToken, "User-Agent": "node.js"},
          "body": JSON.stringify({ title: theTitle, body: req.body.feedback, labels: labelArray, assignees: assigneeArray})
          }, function(err, response, body) {
              console.log(body);
              if (err) console.log(err);
        });
  }
  else
  {
      request({
          "url":"ADD YOUR GITHUB REPO FOR ISSUES HERE",
          "method":"POST",
          "headers": {"Authorization": authToken, "User-Agent": "node.js"},
          "body": JSON.stringify({ title: theTitle, body: req.body.feedback, labels: labelArray})
          }, function(err, response, body) {
              console.log(body);
              if (err) console.log(err);
        });
  }
    fs.readFile("thank.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
 });
 
function validateEmail(email)
{
  var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
}
