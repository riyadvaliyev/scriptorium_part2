# Key Idea: From Piazza post @492, we likely need to make seperate docker files for each languagge
# Reason: We need seperate containers for each language
# Use the official OpenJDK base image
FROM openjdk:11-slim

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

# Verify the Java installation
RUN java -version

# Default command to keep the container running (optional)
CMD ["bash"]











# V1
# # Base image
# FROM node:20

# # Install dependencies for all languages (Python, Java, Ruby, etc.)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     python3 python3-pip \
#     openjdk-11-jdk \
#     gcc g++ \
#     ruby-full \
#     r-base \
#     rustc \
#     bash \
#     build-essential \
#     && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# # Install global npm packages (only if needed)
# RUN npm install -g npx

# # Set the default working directory in the container
# WORKDIR /scriptorium

# # Copy package.json and package-lock.json (for caching dependencies)
# COPY package*.json ./

# # Install npm dependencies
# RUN npm install

# # Copy the rest of your application code
# COPY . .

# # Make sure startup.sh is executable
# RUN chmod +x startup.sh

# # Expose ports if needed (e.g., for a web API)
# EXPOSE 3000

# # Set the default command to run your app
# CMD ["bash", "startup.sh"]

