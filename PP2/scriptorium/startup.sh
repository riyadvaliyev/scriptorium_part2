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

# Set up Docker containers using docker-compose
# Navigate to the directory where the docker-compose.yml is located 
# In this case, this directory is 1 level deeper inside the docker folder
cd docker

# Start up Docker containers
docker-compose up --build -d  # -d means to run the containers in detatched mode (frees the terminal to do other things)
