FROM node:latest

# Set a working directory
WORKDIR /usr/my_app

# Copy application files
COPY . /usr/my_app

RUN yarn
RUN yarn build

# Exec
CMD [ "yarn", "start:prod" ]
