FROM node:8

# Create app directory
WORKDIR /usr/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
COPY . /usr/src

ENV LP_ACCOUNT=69779575
ENV LP_USER=Bot2

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 9010
CMD [ "node", "agent.js" ]