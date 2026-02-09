# Serverless File Sharing Platform

A fully serverless file sharing web application built using Amazon Web Services (AWS).
The platform allows authenticated users to upload, view, download, delete, and share files securely without managing any traditional backend servers.This project demonstrates the practical implementation of serverless architecture using managed AWS services.
    

## Project Overview

The Serverless File Sharing Platform is designed to provide secure, scalable, and cost-effective file storage and sharing similar to services like Google Drive or Dropbox.
The application eliminates server management by leveraging AWS-managed services such as Lambda, S3, DynamoDB, API Gateway, and Cognito.

## Key Features

-User authentication using Amazon Cognito

-Secure file upload and download

-File listing and deletion

-Shareable file links using pre-signed URLs

-Automatic scaling with serverless services

-No backend server management

-Secure storage using Amazon S3

## System Architecture
```text
  Frontend (HTML/CSS/JS)
        ↓
API Gateway (REST API with CORS)
        ↓
AWS Lambda (Backend Logic)
        ↓
Amazon S3 (File Storage)
        ↓
Amazon DynamoDB (File Metadata)
```

Authentication is handled separately using Amazon Cognito, and JWT tokens are used to authorize API requests.


## Technology Stack

### Frontend: 
  
  HTML5, CSS3,JavaScript

Hosted as a static website (S3 / Vercel)

### Backend: 

AWS Lambda (Python 3.12), Amazon API Gateway (REST API)
  
### Storage & Database: 

Amazon S3 – file storage, Amazon DynamoDB – file metadata storage
  
### Authentication:  

Amazon Cognito User Pools, JWT token-based authentication

### Aws Services Used

``` text
| Service     | Purpose                                 |
| ----------- | --------------------------------------- |
| Amazon S3   | File storage and static website hosting |
| AWS Lambda  | Backend business logic                  |
| API Gateway | REST API endpoints with CORS            |
| DynamoDB    | Metadata storage                        |
| Cognito     | User authentication and authorization   |
| IAM         | Role-based access control               |
| CloudWatch  | Logging and monitoring                  |
```

### Lambda Functions

The backend consists of the following AWS Lambda functions:

```text
| Function Name | Description                                         |
| ------------- | --------------------------------------------------- |
| UploadFile    | Uploads files to S3 and stores metadata in DynamoDB |
| listFiles     | Retrieves user files from DynamoDB                  |
| DownloadFile  | Generates a pre-signed S3 download URL              |
| DeleteFile    | Deletes files from S3 and removes metadata          |
| ShareFile     | Generates shareable pre-signed URLs                 |
```

## Project Structure

```text
ServerlessFileSharing/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── styles.css
│   ├── app.js
│   └── auth.js
│
├── lambdas/
│   ├── UploadFile/
│   ├── listFiles/
│   ├── DownloadFile/
│   ├── DeleteFile/
│   └── ShareFile/
│
├── .gitignore
└── README.md
```

## How File Upload Works

-User logs in using Amazon Cognito

-Cognito returns a secure JWT token

-User selects a file on the dashboard

-Frontend sends a request to API Gateway with the token

-API Gateway triggers the UploadFile Lambda

-Lambda uploads the file to Amazon S3

-File metadata is stored in DynamoDB

-Success response is returned to frontend


## Security Considerations

-AWS credentials are not stored in the repository

-.env files are ignored using .gitignore

-Files are securely stored in Amazon S3

-API access is protected using Cognito authentication

-IAM roles follow least-privilege access


## Deployment Notes

-Frontend can be hosted using Amazon S3 or Vercel

-Backend services are deployed using AWS Console

-API Gateway endpoints must be configured in frontend JavaScript files

-CORS must be enabled on API Gateway routes


## Limitations & Future Enhancements

  ### Current Limitations

-No folder-based organization

-No file version control

-No real-time file preview


### Future Enhancements

-Folder support

-Expirable or revocable share links

-Drag-and-drop uploads

-File preview and tagging

-Role-based access control

-Activity logs and notifications


## Conclusion

This project demonstrates how a real-world file sharing system can be built using serverless cloud services.
By leveraging AWS-managed services, the platform achieves scalability, security, and cost efficiency without maintaining 
any traditional backend infrastructure.




