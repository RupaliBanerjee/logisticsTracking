#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to the client directory
cd client

# Install dependencies and build the client
npm install
npm run build

# Navigate back to the root directory
cd ..

# Create a zip file using Node.js
# node -e "
# const AdmZip = require('adm-zip');
# const path = require('path');
# const zip = new AdmZip();

# const distPath = path.join(__dirname, 'client', 'dist');
# zip.addLocalFolder(distPath);
# zip.writeZip(path.join(__dirname, 'client', 'dist.zip'));

# console.log('dist.zip file created successfully');
# "

# Deploy the zipped dist folder to Azure
az webapp deployment source config-zip --resource-group RG_Webapp --name StarlinkGlobalNewTask --src client/dist.zip

# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Deploy the server to Azure (assumes app service is set up for Node.js)
az webapp up --resource-group RG_Webapp --name StarlinkGlobalNewTask --runtime "NODE|18-lts"
