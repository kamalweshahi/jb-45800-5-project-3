#!/bin/bash
set -e

BUCKET="vacation-images"
IMAGES_DIR="/etc/localstack/init/ready.d/images"

awslocal s3 mb "s3://${BUCKET}" || true

cat > /tmp/vacation-bucket-policy.json <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicRead",
    "Effect":"Allow",
    "Principal":"*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::${BUCKET}/*"]
  }]
}
POLICY

awslocal s3api put-bucket-policy \
  --bucket "${BUCKET}" \
  --policy file:///tmp/vacation-bucket-policy.json

for image in "${IMAGES_DIR}"/*; do
  filename="$(basename "$image")"

  case "${filename,,}" in
    *.jpg|*.jpeg) content_type="image/jpeg" ;;
    *.png)        content_type="image/png" ;;
    *.webp)       content_type="image/webp" ;;
    *.svg)        content_type="image/svg+xml" ;;
    *)            content_type="application/octet-stream" ;;
  esac

  awslocal s3 cp "$image" "s3://${BUCKET}/${filename}" \
    --content-type "$content_type"
done
