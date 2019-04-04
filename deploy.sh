pm2 stop all
npm run build
cp -a build/. /var/www/html/
pm2 start server/server.js -e err.log -o out.log

