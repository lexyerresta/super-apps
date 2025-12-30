# Microservices Architecture

This document explains the microservices architecture of Super Apps.

## Overview

Super Apps uses a **microservices architecture** to separate concerns, enable scalability, and improve maintainability. Each service is independently deployable and focuses on a specific domain.

## Architecture Diagram

```
                    ┌──────────────────┐
                    │   User Browser   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   Frontend       │  Next.js (Port 3000)
                    │   (Web UI)       │  - 65+ mini apps
                    │                  │  - Client-side routing
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   API Gateway    │  Express (Port 8080)
                    │                  │  - Request routing
                    │                  │  - Health checks
                    │                  │  - Error handling
                    └────────┬─────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
    ┌───────▼────────┐              ┌────────▼────────┐
    │  PDF Service   │              │  Media Service  │
    │  (Port 3001)   │              │  (Port 3002)    │
    │                │              │                 │
    │  - Merge PDFs  │              │  - Audio conv.  │
    │  - Split PDFs  │              │  - Video conv.  │
    │  - Compress    │              │  - Extraction   │
    │  - Get Info    │              │  - Get Info     │
    └────────────────┘              └─────────────────┘
```

## Services

### 1. Frontend (Web)
- **Technology**: Next.js 14+, React, TypeScript
- **Port**: 3000
- **Responsibilities**:
  - Render UI for all 65+ apps
  - Handle client-side routing
  - Make API calls to backend services
  - Provide offline fallbacks

### 2. API Gateway
- **Technology**: Express.js, http-proxy-middleware
- **Port**: 8080
- **Responsibilities**:
  - Route requests to appropriate microservices
  - Centralized error handling
  - Service health monitoring
  - CORS management
  - Future: Authentication, rate limiting

**Routes**:
- `/api/pdf/*` → PDF Service
- `/api/media/*` → Media Service
- `/health` → Gateway health
- `/api/status` → All services status

### 3. PDF Service
- **Technology**: Express.js, pdf-lib
- **Port**: 3001
- **Responsibilities**:
  - PDF manipulation (merge, split, compress)
  - Extract PDF metadata
  - PDF validation

**Endpoints**:
- `POST /merge` - Merge multiple PDFs
- `POST /split` - Split PDF into individual pages
- `POST /compress` - Reduce PDF file size
- `POST /info` - Get PDF information

### 4. Media Service
- **Technology**: Express.js, FFmpeg, fluent-ffmpeg
- **Port**: 3002
- **Responsibilities**:
  - Audio format conversion
  - Video format conversion
  - Audio extraction from video
  - Media metadata extraction

**Endpoints**:
- `POST /convert/audio` - Convert audio formats
- `POST /convert/video` - Convert video formats
- `POST /extract-audio` - Extract audio track
- `POST /info` - Get media information

## Communication Pattern

1. **Client → Frontend**: HTTP(S)
2. **Frontend → API Gateway**: HTTP REST API
3. **API Gateway → Services**: HTTP proxy (internal network)
4. **Services → Services**: Currently none (future: message queue)

## Data Flow Example: PDF Merge

```
User uploads PDFs
   ↓
Frontend (PDFToolsApp.tsx)
   ↓ POST /api/pdf/merge
API Gateway
   ↓ Proxy to PDF Service
PDF Service
   ↓ Process with pdf-lib
   ↓ Return merged PDF
API Gateway
   ↓ Forward response
Frontend
   ↓ Trigger download
User receives file
```

## Scalability Considerations

### Current State
- All services run as Docker containers
- Docker Compose for local orchestration
- Shared volumes for file uploads

### Future Improvements
1. **Horizontal Scaling**: Multiple instances per service
2. **Load Balancer**: NGINX or cloud load balancer
3. **Message Queue**: RabbitMQ/Redis for async jobs
4. **Database**: PostgreSQL for job tracking
5. **Caching**: Redis for frequently accessed data
6. **Storage**: S3-compatible object storage
7. **Monitoring**: Prometheus + Grafana
8. **Logging**: ELK stack

## Deployment

### Docker Compose (Development/Testing)
```bash
docker-compose up --build
```

### Production Considerations
1. **Kubernetes**: Deploy each service as a deployment
2. **Environment Variables**: Externalize configuration
3. **Secrets Management**: Use Kubernetes secrets or Vault
4. **Health Checks**: Already implemented in each service
5. **Auto-scaling**: Based on CPU/memory metrics

## Benefits of This Architecture

✅ **Separation of Concerns**: Each service has a single responsibility
✅ **Independent Scaling**: Scale PDF service independently of Media service
✅ **Technology Flexibility**: Each service can use different tech stack
✅ **Fault Isolation**: If Media service fails, PDF still works
✅ **Team Autonomy**: Different teams can own different services
✅ **Easier Testing**: Test services in isolation
✅ **Deployment Flexibility**: Deploy services independently

## Trade-offs

⚠️ **Complexity**: More moving parts than monolith
⚠️ **Network Latency**: Inter-service communication overhead
⚠️ **Data Consistency**: No distributed transactions (yet)
⚠️ **DevOps Overhead**: More containers to manage
⚠️ **Debugging**: Distributed tracing needed for production

## Development Workflow

1. **Local Development**: Run services individually
2. **Integration Testing**: Use Docker Compose
3. **Production**: Deploy to Kubernetes/cloud

## Adding New Microservices

1. Create new directory: `backend/new-service/`
2. Add `package.json`, `Dockerfile`, `src/app.js`
3. Implement Express server with `/health` endpoint
4. Update `docker-compose.yml`
5. Update API Gateway routes
6. Update frontend to call new service

## Security Considerations

- [ ] Add API authentication (JWT)
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Sanitize file uploads
- [ ] Add HTTPS in production
- [ ] Implement CORS properly
- [ ] Add security headers
- [ ] Scan Docker images for vulnerabilities

## Monitoring & Observability

### Current
- Basic console logging
- Health check endpoints

### Planned
- Structured logging (JSON)
- Request tracing (correlation IDs)
- Metrics collection (Prometheus)
- Distributed tracing (Jaeger)
- Error tracking (Sentry)

## Resources

- [Microservices.io](https://microservices.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Documentation](https://nextjs.org/docs)
