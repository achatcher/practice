Here's the exact step-by-step plan. I'll build all the code, you follow the 
  AWS console steps.                     
                                                                              
  Step 1 — S3 Bucket                                                          
                                                                              
  Go to S3 in AWS console → Create bucket:                  
  - Name: ksocial-config
  - Region: us-east-1
  - Uncheck "Block all public access" (the JSON files need to be publicly
  readable)
  - Everything else default → Create

  Then upload your two JSON files:
  - public/config/locations/kalamazoo/businesses.json
  - public/config/locations/kalamazoo/events.json
  - public/config/app-config.json

  Then set a bucket policy so the files are publicly readable. In the bucket →
   Permissions → Bucket Policy, paste:

  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::ksocial-config/*"
      }
    ]
  }

  Your app will then fetch from:
  https://ksocial-config.s3.us-east-1.amazonaws.com/locations/kalamazoo/busine
  sses.json

  ---
  Step 2 — Lambda IAM Role

  Go to IAM → Roles → Create Role:
  - Trusted entity: AWS Service → Lambda
  - Attach policy: AmazonS3FullAccess
  - Name: ksocial-lambda-role
  - Create

  ---
  Step 3 — Lambda Function

  Go to Lambda → Create function:
  - Name: ksocial-admin-api
  - Runtime: Node.js 20.x
  - Execution role: use existing → ksocial-lambda-role
  - Create

  Then replace the default code with what I'll write below, and hit Deploy.

  ---
  Step 4 — API Gateway

  Go to API Gateway → Create API → HTTP API:
  - Name: ksocial-admin
  - Add integration: Lambda → ksocial-admin-api
  - Routes: ANY /{proxy+}
  - Stage: $default with auto-deploy
  - Create

  Copy the invoke URL — it'll look like
  https://abc123.execute-api.us-east-1.amazonaws.com

  ---
  Step 5 — Admin panel in your app

  I'll add an /admin route with a login screen and full business/events
  management UI.

  ---
  Ready for me to write all the code now? I'll do:
  1. The Lambda function code
  2. The updated useAppConfig.js pointing to S3
  3. The full admin panel Vue component