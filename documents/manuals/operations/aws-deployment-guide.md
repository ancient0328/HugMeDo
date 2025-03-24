# AWS デプロイガイド

## 文書情報

| 項目 | 内容 |
|------|------|
| 文書番号 | GUIDE-001 |
| 作成日 | 2025-03-21 |
| 作成者 | HugMeDoチーム |
| ステータス | ドラフト |
| 関連文書 | ARCH-001（アーキテクチャ概要）, DEC-001（認証システム選定） |

## 1. 概要

このガイドは、HugMeDoアプリケーション（コンテナ化モジュラーモノリス）をAWS環境にデプロイするための手順を提供します。ローカルのDocker Compose環境から本番用AWSインフラへの移行を1週間で完了させることを目標としています。

## 2. 前提条件

### 2.1 必要なツール

- AWS CLI（最新版）
- Docker および Docker Compose
- Node.js 18以上
- pnpm
- Git

### 2.2 AWS アカウント設定

- AWS アカウント
- 管理者権限を持つIAMユーザー
- AWS CLIの設定済み認証情報

```bash
# AWS CLI設定
aws configure
# AWS_ACCESS_KEY_ID: [your-access-key]
# AWS_SECRET_ACCESS_KEY: [your-secret-key]
# Default region name: ap-northeast-1
# Default output format: json
```

## 3. デプロイ計画

### 3.1 デプロイ手順概要

1. **インフラストラクチャのセットアップ** (Day 1-2)
   - VPC、サブネット、セキュリティグループの作成
   - ECRリポジトリの作成
   - RDSインスタンスのセットアップ

2. **アプリケーションのAWS対応** (Day 3-4)
   - 環境変数の調整
   - Dockerfileの最適化
   - ECSタスク定義の作成

3. **認証システムのセットアップ** (Day 5)
   - Cognitoユーザープールの設定
   - アプリケーションとの統合

4. **CI/CDパイプラインのセットアップ** (Day 6)
   - GitHub Actionsワークフローの作成
   - デプロイ自動化

5. **テストと最終調整** (Day 7)
   - エンドツーエンドテスト
   - 監視とアラートの設定
   - ドメイン設定とSSL証明書

### 3.2 デプロイタイムライン

| 日程 | 作業内容 | 担当者 | 成果物 |
|------|---------|-------|--------|
| Day 1 | VPC、サブネット、セキュリティグループ設定 | インフラ担当 | AWS基本ネットワーク |
| Day 1 | ECRリポジトリ作成 | インフラ担当 | Dockerイメージリポジトリ |
| Day 2 | RDSインスタンス作成 | インフラ担当 | PostgreSQLデータベース |
| Day 3 | 環境変数調整 | 開発担当 | 本番用環境設定 |
| Day 3-4 | Dockerfile最適化 | 開発担当 | 本番用Dockerイメージ |
| Day 4 | ECSタスク定義作成 | インフラ担当 | コンテナ実行定義 |
| Day 5 | Cognito設定 | 開発担当 | 認証システム |
| Day 6 | CI/CD設定 | 開発担当 | 自動デプロイパイプライン |
| Day 7 | テストと調整 | QA担当 | 動作確認レポート |

## 4. インフラストラクチャのセットアップ

### 4.1 VPC設定

```bash
# VPC作成
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=hugmedo-vpc}]'

# サブネット作成 (パブリック)
aws ec2 create-subnet --vpc-id vpc-xxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone ap-northeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=hugmedo-public-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone ap-northeast-1c --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=hugmedo-public-1c}]'

# サブネット作成 (プライベート)
aws ec2 create-subnet --vpc-id vpc-xxxxxxxx --cidr-block 10.0.3.0/24 --availability-zone ap-northeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=hugmedo-private-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxxxxx --cidr-block 10.0.4.0/24 --availability-zone ap-northeast-1c --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=hugmedo-private-1c}]'

# インターネットゲートウェイ作成
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=hugmedo-igw}]'
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxxxxx --internet-gateway-id igw-xxxxxxxx

# ルートテーブル設定
aws ec2 create-route-table --vpc-id vpc-xxxxxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=hugmedo-public-rt}]'
aws ec2 create-route --route-table-id rtb-xxxxxxxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxxxxx
```

### 4.2 セキュリティグループ設定

```bash
# アプリケーション用セキュリティグループ
aws ec2 create-security-group --group-name hugmedo-app-sg --description "Security group for HugMeDo application" --vpc-id vpc-xxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port 40000 --cidr 0.0.0.0/0

# モジュールサービス用セキュリティグループ
aws ec2 create-security-group --group-name hugmedo-modules-sg --description "Security group for HugMeDo modules" --vpc-id vpc-xxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port-range 40100-40199 --source-group sg-xxxxxxxx

# APIゲートウェイ用セキュリティグループ
aws ec2 create-security-group --group-name hugmedo-api-sg --description "Security group for HugMeDo API Gateway" --vpc-id vpc-xxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port 40040 --cidr 0.0.0.0/0

# データベース用セキュリティグループ
aws ec2 create-security-group --group-name hugmedo-db-sg --description "Security group for HugMeDo database" --vpc-id vpc-xxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port 5432 --source-group sg-xxxxxxxx
```

### 4.3 ECRリポジトリ作成

```bash
# リポジトリ作成
aws ecr create-repository --repository-name hugmedo/app --image-scanning-configuration scanOnPush=true

# リポジトリURI取得
aws ecr describe-repositories --repository-names hugmedo/app --query 'repositories[0].repositoryUri' --output text
```

### 4.4 RDSインスタンス作成

```bash
# DBサブネットグループ作成
aws rds create-db-subnet-group \
  --db-subnet-group-name hugmedo-db-subnet \
  --db-subnet-group-description "Subnet group for HugMeDo database" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy

# RDSインスタンス作成
aws rds create-db-instance \
  --db-instance-identifier hugmedo-db \
  --db-instance-class db.t3.small \
  --engine postgres \
  --engine-version 14.5 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --master-username hugmedo_admin \
  --master-user-password "YourStrongPassword" \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name hugmedo-db-subnet \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --deletion-protection
```

## 5. アプリケーションのAWS対応

### 5.1 環境変数の調整

```dotenv
# .env.production
NODE_ENV=production
DATABASE_URL=postgres://hugmedo_admin:YourStrongPassword@hugmedo-db.xxxxxxxx.ap-northeast-1.rds.amazonaws.com:5432/hugmedo
AWS_REGION=ap-northeast-1
COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5.2 Dockerfileの最適化

```dockerfile
# 本番用Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# 実行用イメージ
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

ENV NODE_ENV=production

CMD ["node", "apps/web/build"]
```

### 5.3 イメージのビルドとプッシュ

```bash
# ECRログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージビルド
docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/hugmedo/app:latest .

# イメージプッシュ
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/hugmedo/app:latest
```

### 5.4 ECSクラスターとタスク定義

```bash
# ECSクラスター作成
aws ecs create-cluster --cluster-name hugmedo-cluster

# タスク実行ロール作成
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://ecs-task-execution-role.json
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# タスク定義作成
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

**task-definition.json**:
```json
{
  "family": "hugmedo-app",
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "hugmedo-app",
      "image": "${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/hugmedo/app:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 40000,
          "hostPort": 40000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:${AWS_ACCOUNT_ID}:parameter/hugmedo/database_url"
        },
        {
          "name": "COGNITO_USER_POOL_ID",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:${AWS_ACCOUNT_ID}:parameter/hugmedo/cognito_user_pool_id"
        },
        {
          "name": "COGNITO_CLIENT_ID",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:${AWS_ACCOUNT_ID}:parameter/hugmedo/cognito_client_id"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hugmedo-app",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048"
}
```

### 5.5 ECSサービス作成

```bash
# ロードバランサー作成
aws elbv2 create-load-balancer \
  --name hugmedo-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxx \
  --scheme internet-facing \
  --type application

# Webアプリケーション用ターゲットグループ
aws elbv2 create-target-group \
  --name hugmedo-web-tg \
  --protocol HTTP \
  --port 40000 \
  --vpc-id vpc-xxxxxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2

# APIゲートウェイ用ターゲットグループ
aws elbv2 create-target-group \
  --name hugmedo-api-tg \
  --protocol HTTP \
  --port 40040 \
  --vpc-id vpc-xxxxxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2

# モバイルアプリケーション用ターゲットグループ
aws elbv2 create-target-group \
  --name hugmedo-mobile-tg \
  --protocol HTTP \
  --port 40010 \
  --vpc-id vpc-xxxxxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2

# Webアプリケーション用リスナー
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:loadbalancer/app/hugmedo-alb/xxxxxxxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:ap-northeast-1:${AWS_ACCOUNT_ID}:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-web-tg/xxxxxxxx

# APIゲートウェイ用リスナー
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:loadbalancer/app/hugmedo-alb/xxxxxxxx \
  --protocol HTTPS \
  --port 444 \
  --certificates CertificateArn=arn:aws:acm:ap-northeast-1:${AWS_ACCOUNT_ID}:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-api-tg/xxxxxxxx

# モバイルアプリケーション用リスナー
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:loadbalancer/app/hugmedo-alb/xxxxxxxx \
  --protocol HTTPS \
  --port 445 \
  --certificates CertificateArn=arn:aws:acm:ap-northeast-1:${AWS_ACCOUNT_ID}:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-mobile-tg/xxxxxxxx

# ECSサービス作成（Webアプリケーション）
aws ecs create-service \
  --cluster hugmedo-cluster \
  --service-name hugmedo-web-service \
  --task-definition hugmedo-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-web-tg/xxxxxxxx,containerName=hugmedo-app,containerPort=40000"

# ECSサービス作成（APIゲートウェイ）
aws ecs create-service \
  --cluster hugmedo-cluster \
  --service-name hugmedo-api-service \
  --task-definition hugmedo-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-api-tg/xxxxxxxx,containerName=hugmedo-api,containerPort=40040"
```

## 6. 認証システムのセットアップ

### 6.1 Cognitoユーザープールの作成

```bash
# ユーザープール作成
aws cognito-idp create-user-pool \
  --pool-name HugMeDoUsers \
  --auto-verified-attributes email \
  --username-attributes email \
  --mfa-configuration OFF \
  --admin-create-user-config AllowAdminCreateUserOnly=false \
  --schema Name=email,Required=true,Mutable=true Name=name,Required=true,Mutable=true

# ユーザープールID取得
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 20 --query "UserPools[?Name=='HugMeDoUsers'].Id" --output text)

# アプリクライアント作成
aws cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name HugMeDoApp \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --supported-identity-providers COGNITO

# アプリクライアントID取得
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --query "UserPoolClients[?ClientName=='HugMeDoApp'].ClientId" --output text)

# SSMパラメータストアに保存
aws ssm put-parameter --name /hugmedo/cognito_user_pool_id --value $USER_POOL_ID --type SecureString
aws ssm put-parameter --name /hugmedo/cognito_client_id --value $CLIENT_ID --type SecureString
```

### 6.2 アプリケーションとの統合

**src/lib/auth/cognito.ts**:
```typescript
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

export async function registerUser(email: string, password: string, name: string) {
  const params = {
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "name",
        Value: name,
      },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const response = await client.send(command);
    return {
      userId: response.UserSub,
      email,
      name,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    return {
      token: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}
```

## 7. CI/CDパイプラインのセットアップ

### 7.1 GitHub Actionsワークフロー

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: hugmedo/app
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster hugmedo-cluster --service hugmedo-service --force-new-deployment
```

### 7.2 GitHub Secretsの設定

GitHub リポジトリの Settings > Secrets > Actions に以下のシークレットを追加:

1. `AWS_ACCESS_KEY_ID`: AWS IAMユーザーのアクセスキーID
2. `AWS_SECRET_ACCESS_KEY`: AWS IAMユーザーのシークレットアクセスキー

## 8. テストと最終調整

### 8.1 アプリケーションのテスト

```bash
# ヘルスチェックエンドポイント
curl http://hugmedo-alb-xxxxxxxx.ap-northeast-1.elb.amazonaws.com/health

# APIエンドポイント
curl http://hugmedo-alb-xxxxxxxx.ap-northeast-1.elb.amazonaws.com/api/status
```

### 8.2 監視とアラートの設定

```bash
# CloudWatchロググループ作成
aws logs create-log-group --log-group-name /ecs/hugmedo-app

# CloudWatchアラーム設定
aws cloudwatch put-metric-alarm \
  --alarm-name HugMeDo-CPU-High \
  --alarm-description "CPU utilization high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=hugmedo-cluster Name=ServiceName,Value=hugmedo-service \
  --evaluation-periods 3 \
  --alarm-actions arn:aws:sns:ap-northeast-1:${AWS_ACCOUNT_ID}:HugMeDo-Alerts
```

### 8.3 ドメイン設定とSSL証明書

```bash
# ACM証明書リクエスト
aws acm request-certificate \
  --domain-name hugmedo.com \
  --validation-method DNS \
  --subject-alternative-names www.hugmedo.com

# Route 53ホストゾーン作成
aws route53 create-hosted-zone \
  --name hugmedo.com \
  --caller-reference $(date +%s)

# ALBリスナー更新（HTTPS）
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:loadbalancer/app/hugmedo-alb/xxxxxxxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:ap-northeast-1:${AWS_ACCOUNT_ID}:certificate/xxxxxxxx \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:${AWS_ACCOUNT_ID}:targetgroup/hugmedo-tg/xxxxxxxx
```

## 9. 運用とメンテナンス

### 9.1 定期的なバックアップ

```bash
# RDSスナップショット作成
aws rds create-db-snapshot \
  --db-snapshot-identifier hugmedo-db-snapshot-$(date +%Y%m%d) \
  --db-instance-identifier hugmedo-db
```

### 9.2 スケーリング設定

```bash
# Auto Scaling設定
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/hugmedo-cluster/hugmedo-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# スケーリングポリシー作成
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/hugmedo-cluster/hugmedo-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name hugmedo-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

**scaling-policy.json**:
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 60
}
```

### 9.3 セキュリティ更新

```bash
# ECRイメージスキャン
aws ecr start-image-scan --repository-name hugmedo/app --image-id imageTag=latest

# セキュリティグループ更新（例: 特定IPからの管理アクセスのみ許可）
aws ec2 revoke-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx --protocol tcp --port 22 --cidr 203.0.113.0/24
```

## 10. トラブルシューティング

### 10.1 一般的な問題と解決策

| 問題 | 考えられる原因 | 解決策 |
|------|--------------|--------|
| ECSタスクが起動しない | メモリ/CPU不足 | タスク定義のリソース割り当てを確認 |
| データベース接続エラー | セキュリティグループ設定 | RDSセキュリティグループのインバウンドルールを確認 |
| 認証エラー | Cognito設定の問題 | 環境変数とCognitoの設定を確認 |
| デプロイ失敗 | ECRへのプッシュ権限不足 | IAMポリシーを確認 |

### 10.2 ログの確認

```bash
# ECSログの確認
aws logs get-log-events \
  --log-group-name /ecs/hugmedo-app \
  --log-stream-name ecs/hugmedo-app/xxxxxxxx \
  --limit 100

# RDSログの確認
aws rds download-db-log-file-portion \
  --db-instance-identifier hugmedo-db \
  --log-file-name error/postgresql.log \
  --output text
```

## 11. 将来の拡張計画

### 11.1 マイクロサービスへの移行

1. 各モジュールを独立したECSサービスとして分離
2. APIゲートウェイの導入
3. サービス間通信の確立（EventBridge/SNS/SQS）

### 11.2 グローバル展開

1. マルチリージョンデプロイメント
2. Route 53ルーティングポリシーの設定
3. DynamoDBグローバルテーブルの検討

### 11.3 高度なモニタリング

1. AWS X-Rayの導入
2. カスタムCloudWatchダッシュボードの作成
3. サードパーティ監視ツールとの統合（Datadog, New Relic等）

---

*このガイドは、HugMeDoアプリケーションのAWSデプロイ手順を提供するものです。環境やバージョンによって一部手順が異なる場合があります。*

最終更新: 2025-03-21

## ビルドプロセス

HugMeDoのビルドプロセスは以下の順序で実行されます：

1. 共有パッケージのビルド
   ```bash
   # コアライブラリのビルド
   cd packages/core
   pnpm build
   
   # UIコンポーネントのビルド
   cd ../ui
   pnpm build
   
   # ユーティリティのビルド
   cd ../utils
   pnpm build
   ```

2. モジュールのビルド
   ```bash
   # APIゲートウェイモジュールのビルド
   cd ../../modules/api-gateway
   pnpm build
   
   # OHRモジュールのビルド
   cd ../ohr
   pnpm build
   
   # Chatモジュールのビルド
   cd ../chat
   pnpm build
   ```

3. アプリケーションのビルド
   ```bash
   # Webアプリケーションのビルド
   cd ../../apps/web
   pnpm build
   
   # モバイルアプリケーションのビルド
   cd ../mobile
   pnpm build
   ```

4. Dockerイメージのビルド
   ```bash
   # ルートディレクトリに戻る
   cd ../../
   
   # Dockerイメージのビルド
   docker-compose -f docker-compose.prod.yml build
   ```
