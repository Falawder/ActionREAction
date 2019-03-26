FROM mysql:latest

ENV MYSQL_DATABASE area

COPY ./mysql-init.sql /docker-entrypoint-initdb.d/
