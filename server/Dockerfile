FROM node:lts-jessie

WORKDIR /usr/app

COPY . .

RUN npm install --quiet

RUN echo "Europe/Paris" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update && apt-get install -y mysql-client
COPY ./wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh
