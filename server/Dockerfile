# Brug Node.js version 22 som base image
FROM node:22.11.0

# Sæt arbejdsdirectory i containeren
WORKDIR /usr/src/app

# Kopiér package.json og package-lock.json
COPY package*.json ./

# Installer afhængigheder
RUN npm install

# Kopiér resten af backend-koden
COPY . .

# Eksponér port 3000
EXPOSE 3000

# Start backend-serveren
CMD ["npm", "start"]
