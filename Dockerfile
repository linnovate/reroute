# take default image of node boron i.e  node 6.x
FROM node:6.10.1

WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 4040