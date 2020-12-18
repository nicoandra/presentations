FROM node:15.3.0-buster AS get-reveal

RUN git clone https://github.com/hakimel/reveal.js.git
WORKDIR /reveal.js
RUN npm install

FROM node:15.3.0-buster AS slides
WORKDIR /reveal.js
COPY --from=get-reveal /reveal.js /reveal.js

CMD ["npm", "start"]