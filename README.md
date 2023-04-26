<h1 align="center">
  <br>
  <img src="https://github.com/chyke007/facial-vote/blob/main/facial-vote-architecture/VotingFlow.png" alt="Voting Flow" width="700"/>
  <br>
  Face Polls
  <br>
</h1>

<h4 align="center"><a href="#" target="_blank">FacePolls,</a> is Serverless Facial Recognition voting application built entirely using AWS services and adheres to established best practices and uses the Event-Driven pattern.</h4>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<p align="center">
 <a href="#folder-structure">Folder Structure</a> •
  <a href="#key-features">Services Used</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#you-may-also-like">Related</a> •
  <a href="#license">License</a>
</p>

## Folder Structure
This project contains source code for a serverless that can be deployed using the serverless framework. It also contains frontend code built using Next.js that can also be easily deployed or run locally. Also added are the architecture diagrams for the project.

- [facial-vote-admin](https://github.com/chyke007/facial-vote/tree/main/facial-vote-admin) - Admin code for the application.
- [facial-vote-architecture](https://github.com/chyke007/facial-vote/tree/main/facial-vote-architecture) - Contains architectural diagram and workflows for the application
- [facial-vote-backend](https://github.com/chyke007/facial-vote/tree/main/facial-vote-backend) - Contains the backend/serverless portion of the application built using the serverless framework
- [facial-vote-frontend](https://github.com/chyke007/facial-vote/tree/main/facial-vote-frontend) - Contains the frontend of the application built using Next.js

## Services Used

The application utilizes the event driven architecure and is built using AWS services powered by the serverless framework. The following are the AWS services explicitly used

- Amazon EventBridge 
- Amazon S3
- Amazon DynamoDB
- Amazon SES
- AWS Lambda
- Amazon API Gateway
- AWS Step Functions
- AWS IoT
- Amazon Rekognition
- Amazon Cognito
- AWS CloudFormation
- AWS Amplify
- AWS STS

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) v16+ (which comes with [npm](http://npmjs.com)) installed on your computer. Also create an account with AWS, install the AWS CLI in locally, create an IAM user and add this user to AWS CLI as a profile. This profile user should have necessary permissions to deploy the backend section to AWS. Next, add required credentials to the .env file created from the command below. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chyke007/facial-vote.git

# Go into the repository
$ cd facial-vote

# Copy environment variable
$ cp facial-vote-admin/.env.example facial-vote-admin/.env && cp facial-vote-backend/.env.example facial-vote-backend/.env  && cp facial-vote-frontend/.env.example facial-vote-frontend/.env

# Deploy backend (run from folder root)
$ npm i serverless -g
$ cd facial-vote-backend && serverless deploy

# Remove backend resources (run from folder root)
$ cd facial-vote-backend && sls remove

# Run Frontend (run from folder root)
$ cd facial-vote-frontend && npm i && npm run dev

# Run Admin (run from folder root)
$ cd facial-vote-admin && npm i && npm run dev
```
## Architecture
### Face Index Flow

<img src="https://github.com/chyke007/facial-vote/blob/main/facial-vote-architecture/FaceIndexFlow.png" alt="Face Index Flow" width="700" />
 
### Face Recognition/Voting Flow

<img src="https://github.com/chyke007/facial-vote/blob/main/facial-vote-architecture/VotingFlow.png" alt="Voting Flow" width="700" />

### Live Result flow

<img src="https://github.com/chyke007/facial-vote/blob/main/facial-vote-architecture/LiveResultsFlow.png" alt="Live Result Flow" width="700" />

### Admin Flow

<img src="https://github.com/chyke007/facial-vote/blob/main/facial-vote-architecture/AdminFlow.png" alt="Admin Flow" width="700" />

## Documentation

You can find an article that explains the project [here](https://aws.plainenglish.io/serverless-facial-recognition-voting-application-using-aws-services-160fa6b175e)

## You may also like...

- [YumFood](https://github.com/chyke007/yum-food) - An An online food ordering application
- [TrackIt](https://github.com/chyke007/whatsapp-group-bot) - A WhatsApp messages tracker

## License

MIT

---

> [chibuikenwa.com](https://www.chibuikenwa.com) &nbsp;&middot;&nbsp;
> GitHub [@chyke007](https://github.com/chyke007) &nbsp;&middot;&nbsp;
> LinkedIn [@chibuikenwachukwu](https://linkedin.com/in/chibuikenwachukwu)