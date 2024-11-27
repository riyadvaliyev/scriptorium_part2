# Use an official Debian slim base image
FROM debian:bullseye-slim

# Install necessary dependencies, including SBCL and coreutils for timeout command
RUN apt-get update && apt-get install -y \
    sbcl \
    coreutils \
    && apt-get clean

# Create a non-root user and set it as the current user
RUN useradd -m nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# Copy any necessary files
COPY . .

# Verify the SBCL installation
RUN sbcl --version

# Default command to keep the container running (optional)
CMD ["bash"]
