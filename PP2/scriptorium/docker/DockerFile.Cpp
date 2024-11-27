# Use the official Ubuntu base image (for c++)
FROM ubuntu:22.04

# Install necessary packages, including g++ and timeout command
RUN apt-get update && apt-get install -y \
    g++ \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user and set it as the current user
RUN useradd -m nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# Copy any necessary files
# In this case, this copies all files in the current directory (docker)
COPY . .

# Verify the g++ installation
RUN g++ --version

# Default command to keep the container running (optional)
CMD ["bash"]
