# watson-talent-customer-engagement

This is a customer engagement experience, that captures a user's feedback, and then creates an issue in a github repo capturning this input and assigning an owner to the issue.

It makes use of the [GitHub API](https://developer.github.com/v3/) and also the [IBM Carbon Design System](https://www.carbondesignsystem.com/). 

## Flow and structure

First, the flow is very straight forward. A user will come to the URL and see a call to action

<>

Then as they progress, the work through the input screens, and are then thanked.

<>

This application will require you to generate a GitHub token to perform a write operation to create issues.
The app expects an environment variable with this token.

```
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
```

