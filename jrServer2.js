
var http = require("http");
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


// Running Server Details.
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});


app.get('/feedback', function (req, res) {
  fs.readFile("feedback.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
  /*
  var html='';
  html +="<body>";
  html += "<form action='/thank'  method='post' name='form1'>";
  html += "Name:<input type= 'text' name='name'></p>";
  html += "Email:<input type='text' name='email'></p>";
  html += "feedback:<input type='text' name='address'></p>";
  html += "<input type='submit' value='submit'>";
  html += "</form>";
  html += "</body>";
  */
  //res.send(html);
});

app.post('/thank', urlencodedParser, function (req, res){
  var reply='';
  reply += "Your name is " + req.body.name;
  reply += "<br>Your E-mail id is " + req.body.email;
  reply += "<br>Your feedback is " + req.body.feedback;

  var theTitle = 'Issue from ' + req.body.name + ' email: ' + req.body.email;

  console.log( "posting to git");

  //"url":"https://api.github.com/repos/jarusso/test-feedback/issues",
  //"url":"https://github.ibm.com/api/v3/repos/jrusso/talent-feedback/issues",


  request({
      "url":"https://api.github.com/repos/jarusso/test-issue-2/issues",
      "method":"POST",
      "headers": {"Authorization": "token cad9c8e6dc099bae4cc9b8c1ac1132ac44e520a5", "User-Agent": "node.js"},
      "body": JSON.stringify({ title: theTitle, body: req.body.feedback })
      }, function(err, response, body) {
          console.log(body);
          if (err) console.log(err);
    });

  res.send(reply);
 });
