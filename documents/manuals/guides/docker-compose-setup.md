# Docker Compose Setup Guide

**Document Number**: GUIDE-005  
**Created**: 2025-03-22  
**Last Updated**: 2025-03-22  
**Version**: 1.0.0  
**Status**: Draft  
**Related Documents**: ARCH-001 (Architecture Overview), DEV-001 (Development Environment Setup)

## 1. Overview

This document provides detailed instructions for setting up and using Docker Compose for the HugMeDo project. The containerized modular monolith architecture utilizes Docker Compose for both development and production environments to ensure consistency and simplify deployment.

## 2. Prerequisites

Before using Docker Compose with HugMeDo, ensure you have the following installed:

- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Git (for repository access)
- pnpm (for package management)

## 3. Docker Compose Configuration

The HugMeDo project uses a primary `docker-compose.yml` file located in the project root directory. This configuration includes all core services required for development.

### 3.1 Services Overview

The Docker Compose configuration includes the following services:

| Service | Port | Description |
|---------|------|-------------|
| api-gateway | 40040 | API Gateway for routing requests to appropriate modules |
| ohr-module | 40100 | OHR Module for video call functionality |
| chat-module | 40110 | Chat Module for real-time messaging |
| web-frontend | 40000 | Web application frontend |
| mobile-frontend | 40010 | Mobile application frontend |
| postgres | 5432 | PostgreSQL database for persistent storage |
| redis | 6379 | Redis for caching and pub/sub messaging |
| prometheus | 9090 | Prometheus for metrics collection |
| grafana | 3000 | Grafana for monitoring dashboards |

### 3.2 Network Configuration

All services are connected through the `hugmedo-network` bridge network, allowing for seamless communication between containers while maintaining isolation from the host network.

### 3.3 Volume Configuration

The Docker Compose setup uses named volumes for persistent data storage:

- `postgres-data`: PostgreSQL database files
- `redis-data`: Redis data
- `prometheus-data`: Prometheus metrics data
- `grafana-data`: Grafana dashboards and configurations

## 4. Development Workflow

### 4.1 Starting the Development Environment

To start the entire development environment:

```bash
docker-compose up
```

To start in detached mode (background):

```bash
docker-compose up -d
```

To start specific services only:

```bash
docker-compose up api-gateway ohr-module chat-module
```

### 4.2 Stopping the Development Environment

To stop all services:

```bash
docker-compose down
```

To stop and remove volumes (caution: this will delete all data):

```bash
docker-compose down -v
```

### 4.3 Viewing Logs

To view logs for all services:

```bash
docker-compose logs
```

To follow logs for specific services:

```bash
docker-compose logs -f api-gateway ohr-module
```

### 4.4 Rebuilding Services

After making changes to Dockerfiles or code:

```bash
docker-compose build
```

To rebuild and restart specific services:

```bash
docker-compose up -d --build ohr-module chat-module
```

## 5. Environment Variables

The Docker Compose setup uses environment variables defined in the following files:

- `.env.example`: Template for environment variables (committed to git)
- `.env.local`: Local environment variables (not committed to git)

Important environment variables include:

- `NODE_ENV`: Environment mode (development, production)
- `PORT`: Service port numbers
- `REDIS_HOST` and `REDIS_PORT`: Redis connection details
- `API_GATEWAY_URL`: URL for the API Gateway

## 6. Health Checks

All services include health checks to ensure they are running properly. Health check configurations include:

- Test command to verify service health
- Interval between health checks
- Timeout for health check responses
- Number of retries before marking unhealthy
- Start period before beginning health checks

## 7. Production Considerations

For production deployments, consider the following modifications:

### 7.1 Production Docker Compose File

Create a separate `docker-compose.prod.yml` file with production-specific configurations:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 7.2 Security Enhancements for Production

- Use Docker secrets for sensitive information
- Implement proper network segmentation
- Use non-root users in containers
- Apply resource limits
- Enable logging to external services

### 7.3 Scaling in Production

For horizontal scaling in production:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale ohr-module=3 --scale chat-module=2
```

## 8. Troubleshooting

### 8.1 Common Issues

- **Container fails to start**: Check logs with `docker-compose logs [service]`
- **Service unhealthy**: Verify health check configuration and service dependencies
- **Network connectivity issues**: Ensure all services are on the same network
- **Volume permission problems**: Check file permissions in mounted volumes

### 8.2 Debugging Techniques

- Access container shell: `docker-compose exec [service] sh`
- Inspect container: `docker inspect [container_id]`
- Check network: `docker network inspect hugmedo-network`

## 9. Best Practices

- Keep Dockerfiles simple and optimized
- Use multi-stage builds for smaller images
- Implement proper caching strategies
- Regularly update base images
- Follow the principle of least privilege
- Document all custom configurations

## 10. References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Container Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

*This document provides guidelines for Docker Compose setup in the HugMeDo project. For specific implementation details, refer to the actual docker-compose.yml file and related configuration files.*
