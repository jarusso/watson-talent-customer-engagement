var http = require("http");
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.use(express.static(__dirname + '/images/'));


// Running Server Details.
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});


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
  var reply='';
  reply += '<!DOCTYPE html><html><head><meta charset="utf-8" />';
  reply += '<title>IBM Watson Talent Feedback</title>';
  reply += '<link rel="stylesheet" href="https://unpkg.com/carbon-components/css/carbon-components.min.css">';
  reply += '<style>';
  reply += '.container {position: relative;width: 100%;max-width: 400px;}';
  reply += '.container img {width: 100%;height: auto;}';
  reply += '.container .headline {position: absolute;color: #fff;top: 9%;font-size: 72px;left: 25px;}';
  reply += '.container .blurb {position: absolute;color: #fff;top: 20%;font-size: 28px;left: 25px;width: 150%;}';
  reply += '.container .bye {position: absolute;color: #fff;top: 45%;font-size: 42px;left: 25px;}';
  reply += '.container .banner {position: absolute;color: #fff;top: 1%;font-size: 28px;left: 25px;width: 150%}';
  reply += '</style></head><body>';
  reply += '<div class="container">';
  reply += '        <img src="Cityscape.png" alt="" style="width: 2250px">';
  reply += '        <div class="banner">';
  reply += '        <h4>IBM <b>Watson Talent</b> Codename: Ideation Station</h4>';
  reply += '        <div style="height: 20px;"></div>';
  reply += '        </div>';
  reply += '      <div style="font-size:14px;color:#aaa;">Success</div>';
  reply += '        <div style="height: 20px;"></div>';
  reply += '        <div class="headline">Thanks</div>';
  reply += '        <div style="height:20px"></div>';
  reply += '        <div class="blurb">OMG, you\'ve given us such a great idea. We can\'t guarantee that we will be able to make everything but your input will help us prioritize our future work.';
  reply += '        </div>';
  reply += '        <div class="bye">CYA</div>';
  reply += '        </div>';
  reply += '</body></html>';

  //reply += "Your name is " + req.body.name;
  //reply += "<br>Your E-mail id is " + req.body.email;
  //reply += "<br>Your company is " + req.body.company;
  //reply += "<br>Your title is " + req.body.title;
  //reply += "<br>Your feedback is " + req.body.feedback;
  //reply += "<br>Your category is " + req.body.category;
  //reply += "<br>Your value is " + req.body.value;
  //reply += "<br>Your difficulty is " + req.body.difficulty;
  

  var theTitle = 'Issue from <' + req.body.name;
  theTitle += '> email: <' + req.body.email;
  theTitle += '> title: <' + req.body.title;
  theTitle += '> company: <' + req.body.company + '>';

  console.log( "posting to git");

  //"https://api.github.com/repos/jarusso/test-issue-2/issues"
  //"url":"https://api.github.com/repos/jarusso/test-feedback/issues",
  //"url":"https://github.ibm.com/api/v3/repos/jrusso/talent-feedback/issues",

  //var labelArray = [req.body.category, req.body.difficulty, req.body.value];
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

  var authToken = "token " + GITHUB_TOKEN;

  request({
      "url":"https://github.ibm.com/api/v3/repos/russo/talent-feedback/issues",
      "method":"POST",
      "headers": {"Authorization": authToken, "User-Agent": "node.js"},
      "body": JSON.stringify({ title: theTitle, body: req.body.feedback, labels: labelArray })
      }, function(err, response, body) {
          console.log(body);
          if (err) console.log(err);
    });

  res.send(reply);
 });
 
function validateEmail(email)
{
  var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
}
