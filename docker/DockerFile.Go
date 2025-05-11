# Use the official Go base image (slim version)
FROM golang:1.21-alpine

# Install timeout command (part of coreutils)
RUN apk update && apk add --no-cache coreutils

# Create a non-root user and set it as the current user
RUN adduser -D nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# Copy the Go project files into the container
COPY . .

# Verify the Go installation
RUN go version

# Default command to keep the container running (optional)
CMD ["sh"]
