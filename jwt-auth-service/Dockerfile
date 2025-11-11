# base build
FROM node:18-alpine

#working directory
 WORKDIR /usr/src/app

#copy package.json and install dependecines 
COPY package*.json ./
RUN npm install

COPY . . 

EXPOSE 4000

CMD [ "npm" , "start" ]