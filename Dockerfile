# take default image of node boron i.e  node 6.x
FROM node:6.10.1

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 4040
CMD [ "node", "dist/index" ]
