# Environment Variables

## Required Environment Variables

Before deploying the infrastructure, set the following environment variables:

### JWT Secret

```bash
export JWT_SECRET="your-super-secret-jwt-key-here-at-least-256-bits-long"
```

### AWS Configuration

```bash
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
```

## Security Notes

- **JWT_SECRET**: Use a cryptographically secure random string with at least 256 bits
- **AWS Credentials**: Use IAM roles when possible instead of access keys
- **Production**: Never use default values in production environments

## Setting Environment Variables

### For Local Development

```bash
# Create .env file in infra/ directory
echo "JWT_SECRET=your-secret-here" > infra/.env
```

### For CI/CD

Set the environment variables in your CI/CD platform (GitHub Actions, etc.)

### For Production

Use AWS Systems Manager Parameter Store or AWS Secrets Manager for sensitive values.
