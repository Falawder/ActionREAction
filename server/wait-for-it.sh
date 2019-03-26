#!/bin/bash
res=1
while ! mysql area --user=root --password=samthol --host "db" -e status &> /dev/null ; do
    echo "error code : $? Waiting for database connection..."
    sleep 2
done
npm run test
