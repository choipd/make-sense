# base image
FROM node:14.17.6 AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
# COPY yarn.lock /app/yarn.lock
RUN yarn install --silent
# add app
COPY . /app
COPY ./.env ./.env.production
RUN yarn build
RUN ls -a

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder . .
COPY --from=builder /app/build /app/build
COPY --from=builder /app/build/assets /app/build/backoffice/assets
COPY --from=builder /app/build/static /app/build/backoffice/static
RUN yarn global add serve
# expose port
EXPOSE 3000
ENV PORT 3000
CMD ["serve", "-s", "build"]


