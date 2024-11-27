# Use the official Node.js slim base image (version 20 or above)
FROM node:20-slim

# Install timeout command (part of coreutils)
RUN apt-get update && apt-get install -y coreutils

# Create a non-root user and set it as the current user
RUN useradd -m nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# Copy any necessary files 
# In this case, this copies all files in the scriptorium directory
COPY . . 

# Verify the Node.js installation
RUN node --version

# Verify the npm installation
RUN npm --version

# Default command to keep the container running (optional)
CMD ["bash"]
