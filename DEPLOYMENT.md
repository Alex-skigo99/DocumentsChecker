# AWS Lambda Deployment Configuration

## Environment Variables Required

Set these environment variables in your AWS Lambda function:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Lambda Configuration

- **Runtime**: Node.js 18.x or 20.x
- **Handler**: index.handler
- **Memory**: 512 MB (minimum, increase if processing large files)
- **Timeout**: 30 seconds (adjust based on document processing time)

## Deployment

### Using AWS CLI

1. Create a deployment package:
```bash
zip -r documents-checker.zip . -x "*.git*" "test-lambda.js" "README.md"
```

2. Update the Lambda function:
```bash
aws lambda update-function-code \
  --function-name DocumentsChecker \
  --zip-file fileb://documents-checker.zip
```

### Using AWS SAM (recommended)

Create a `template.yaml` file in your project root:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  DocumentsChecker:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: index.handler
      Runtime: nodejs18.x
      MemorySize: 512
      Timeout: 30
      Environment:
        Variables:
          OPENAI_API_KEY: !Ref OpenAIApiKey
      
Parameters:
  OpenAIApiKey:
    Type: String
    NoEcho: true
    Description: OpenAI API Key
```

Then deploy with:
```bash
sam build
sam deploy --guided
```

## Expected Response Format

The Lambda will return a response with this structure:

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "does_business_name_match": true,
    "does_address_match": true,
    "file_results": [
      {
        "fileName": "document.pdf",
        "does_business_name_match": true,
        "does_address_match": true
      }
    ],
    "processed_files_count": 1
  }
}
```
