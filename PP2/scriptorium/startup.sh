# TODO: Note - This is the original (commented out) version of startup.sh from PP1 (as reference)
# #!/bin/bash

# cd scriptorium
# npm install
# npx prisma migrate dev
# npx prisma generate
# node createAdmin.js

#!/bin/bash

# Step 1: Set up your environment (navigate to the scriptorium directory, install dependencies, etc.)
cd scriptorium

# Install necessary npm packages
npm install

# Run Prisma migrations and generate the Prisma client
npx prisma migrate dev
npx prisma generate

# Create the admin user (if applicable)
node createAdmin.js
cp startup.env .env

# Start up Docker containers
# Note: Even thought the docker containers are in the docker folder, we're still running them in the current directory
docker-compose -f docker/docker-compose.yml -p scriptorium_docker_containers up --build -d # -d means to run the containers in detatched mode (frees the terminal to do other things)
