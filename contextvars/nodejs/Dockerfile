FROM node:lts-alpine3.13 as base
WORKDIR /app
COPY . /app
RUN npm i
RUN mkdir /sample-data
RUN wget https://www.donneesquebec.ca/recherche/dataset/1eea80a9-a1ca-4d4f-8210-dc1828e89822/resource/b728c9e5-da8b-41fc-9790-a63c25464146/download/montreal.json -O /sample-data/montreal.json

FROM base AS express
CMD ["npm", "run", "start-express"]

FROM base AS hapi
CMD ["npm", "run", "start-hapi"]