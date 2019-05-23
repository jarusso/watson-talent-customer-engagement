# watson-talent-customer-engagement

This is a customer engagement experience, that captures a user's feedback, and then creates an issue in a GitHub repo capturing this input and assigning an owner to the issue.

It makes use of the [GitHub API](https://developer.github.com/v3/) and also the [IBM Carbon Design System](https://www.carbondesignsystem.com/). 

## Flow and structure

First, the flow is very straight forward. A user will come to the URL and see a call to action

![Call to action](https://github.com/jarusso/watson-talent-customer-engagement/blob/master/readme-images/CallToAction.png)

Then as they progress, the work through the input screens, and are then thanked.

![Category](https://github.com/jarusso/watson-talent-customer-engagement/blob/master/readme-images/Category.png)

![Comments](https://github.com/jarusso/watson-talent-customer-engagement/blob/master/readme-images/Comments.png)

![Contact](https://github.com/jarusso/watson-talent-customer-engagement/blob/master/readme-images/Contact.png)

![Thanks](https://github.com/jarusso/watson-talent-customer-engagement/blob/master/readme-images/Thanks.png)


### GitHub token

This application will require you to generate a GitHub token to perform a write operation to create issues.
The app expects an environment variable with this token.

```
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
```

To learn how to get your GitHub token, please check out [Creating a personal access token for the command line](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

### GitHub Repo URLs

There are comments in line where you need to add in your GitHub repo URL. 

### Owners JSON 

First, there's this one;

```
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
    
```

This is where you need to drop in your `owners.json` file. This file is used to assign owners to the issue being created, based on the input area selected by the user. I've an exampled file here, [owners.json](https://github.com/jarusso/watson-talent-customer-engagement/blob/latest-running-updates/owners.json), which has this content;

```
{
"Artificial Intelligence":"github-id-owner", 
"User Experience":"github-id-owner",
"New Product": "github-id-owner",
"Product Enhancement":"github-id-owner",
"General Complaint":"github-id-owner",
"Other":"github-id-owner"
}
```

It uses the categories in the user experience and each has the value of the GitHub ID of the person who you want to assign. 

### Repo for issue creation

You need to also drop in the URL to the repo where you want to create these issues. 

```
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

```

