#!/bin/bash
set -e

# Base directories
SITE_DIR="/home/fast-learner/Documents/achal-artworks-site"
TF_DIR="$SITE_DIR/terraform"

echo "=== Step 1: Initializing & Applying Terraform Configuration ==="
cd "$TF_DIR"
terraform init
terraform apply -auto-approve

# Extract outputs
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)

echo ""
echo "=== Step 2: Uploading Assets and Web Page to S3 Bucket ($BUCKET_NAME) ==="
cd "$SITE_DIR"

# Sync website files excluding terraform configurations and deployment script
aws s3 sync . "s3://$BUCKET_NAME" \
  --exclude "terraform/*" \
  --exclude "deploy.sh" \
  --exclude ".git/*"

echo ""
echo "=== Step 3: Deployment Successful! ==="
echo "Your website is live at:"
echo "https://$CLOUDFRONT_DOMAIN"
echo "======================================"
