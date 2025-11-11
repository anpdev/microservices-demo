# base image
FROM node:18-alpine

#create a directory
WORKDIR /usr/src/app

#Copy package.json   
COPY package*.json ./

#install dependencies
RUN npm install

#copy app src 
COPY . . 

# Expose the port and run app

EXPOSE 4005

CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost:4005/health || exit 1

