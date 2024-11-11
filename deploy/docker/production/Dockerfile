# base image
FROM node:14.17.6 AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
# COPY yarn.lock /app/yarn.lock
RUN npm install 
# add app
COPY . /app

RUN npm run build
RUN ls -a

FROM node:16-alpine AS runner
WORKDIR /app
# COPY --from=builder . .
COPY --from=builder /app/build /app/build
COPY --from=builder /app/build /app/build/labeler/

RUN npm install -g serve
# expose port

EXPOSE 3008
ENV PORT 3008

CMD ["serve", "-s", "build", "-l", "3008"]