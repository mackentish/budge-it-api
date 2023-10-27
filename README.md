# Running Locally

## Basic Setup (without Docker and/or Existing DB)

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory of the project based on the `.env.example` file
4. Start the dev build: `npm run dev`

## Using MongoDB with Docker

1. Install Docker if you don't already have it (you can check with `docker --version`)
2. Pull down the mongo container: `docker pull mongo`
3. Run `docker run -d -p 27017:27017 --name my-mongo mongo:latest`
   This command will create a new container named 'my-mongo' and bind the container's port 27017 to your local port 27017.
   The `-d` option allows the container to run in the background, this is optional and you can choose to remove the flag.

## Using My DB Image from Docker

1. Pull down my image from Docker Hub: `docker pull btish/budge-it_db:latest`
2. Run the container: `docker run --name some-mongo -d btish/budge-it_db:latest mongod --bind_ip_all`
   Again, the `-d` flag is optional. It allows the container to run in the background.
