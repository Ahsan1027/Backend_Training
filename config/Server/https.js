const https = require('https');
const fs = require('fs');
// const server = require('./http');



const options = {
    key : fs.readFileSync('/Users/qbatch/Downloads/api-boiler-plate-master/server.key'),
    cert : fs.readFileSync('/Users/qbatch/Downloads/api-boiler-plate-master/server.cert'),
}

const server = https.createServer(options,(req,res)=>{
    res.end('ending...')
})

module.exports = server;