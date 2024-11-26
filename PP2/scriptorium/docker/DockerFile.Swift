# # Use an official R base image with the specified version
# FROM r-base:4.2.2

# # Install additional utilities such as timeout (part of coreutils)
# RUN apt-get update && apt-get install -y coreutils

# # Create a non-root user and set it as the current user
# # RUN useradd -m nonrootuser

# # Switch to the non-root user
# # USER nonrootuser

# # Set the working directory inside the container
# WORKDIR /scriptorium_docker_files

# # Copy any necessary files
# COPY . .

# # Verify the R installation
# RUN R --version

# # Default command to keep the container running (optional)
# CMD ["bash"]

# Use the official Swift base image (non-slim version)
FROM swift:5.7

# Install timeout command (part of coreutils)
USER root
RUN apt-get update && apt-get install -y coreutils

# Create a non-root user and set it as the current user
RUN useradd -m nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# Copy any necessary files
COPY . .

# Verify the Swift installation
RUN swift --version

# Default command to keep the container running (optional)
CMD ["bash"]

