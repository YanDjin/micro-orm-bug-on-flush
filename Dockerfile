FROM node:16.16

RUN apt-get update && apt-get install -y procps

ENV TZ="Africa/Algiers"

WORKDIR /app

COPY . .

WORKDIR /app

EXPOSE 3000
