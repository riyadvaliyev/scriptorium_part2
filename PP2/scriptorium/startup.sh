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

# Step 2: Set up Docker containers using docker-compose
# Navigate to the directory where the docker-compose.yml is located (you mentioned it's inside the 'docker' directory)
cd docker

# Start up Docker containers
docker-compose up --build -d  # -d runs the containers in detached mode

# Step 3: Optionally, add any additional commands needed, like checking logs or waiting for services
# For example, you could check if the containers started successfully
# docker ps  # This will show you the running containers
