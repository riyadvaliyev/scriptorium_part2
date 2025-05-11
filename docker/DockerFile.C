# Use the official GCC slim base image
FROM gcc:11.4

# Install timeout command (part of coreutils)
RUN apt-get update && apt-get install -y coreutils

# Create a non-root user and set it as the current user
RUN useradd -m nonrootuser

# Switch to the non-root user
USER nonrootuser

# Set the working directory inside the container
WORKDIR /scriptorium_docker_files

# In this case, this copies all files in the current directory (docker)
COPY . .

# Verify the GCC installation
RUN gcc --version

# Default command to keep the container running (optional)
CMD ["bash"]
