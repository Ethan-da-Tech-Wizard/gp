# Dockerfile for Standalone Quote Portal Service
FROM python:3.12-slim

WORKDIR /app

# Copy application files
COPY server.py /app/
COPY index.html /app/

# Environment variables
ENV PORT=8080
ENV QUOTE_PORTAL_DB=/app/data/quote_portal.db

# Expose HTTP port
EXPOSE 8080

# Run server
CMD ["python3", "server.py"]
