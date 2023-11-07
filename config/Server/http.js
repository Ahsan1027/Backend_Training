const http = require('http');
const arr = [];
const server = http.createServer((req, res) => {
    // res.statusCode = 200;
    // res.write('HTTP server ')
    // res.end('Send it')
    if (req.method === 'GET') {
        res.statusCode = 200;
        // res.setHeader('Content-Type', 'text/plain');
        res.end('GET request received');
    // } else if (req.method === 'POST') {
    //     // let requestBody = '';
    //     const a = req.body;
    //     arr.push(a);
    //    // res.write(a)
    //     res.end(a)
    //     // req.on('data', (chunk) => {
    //     //     // Collect the POST data
    //     //     requestBody += chunk;
    //     // });

    //     // req.on('end', () => {
    //     //     res.statusCode = 200;
    //     //     // res.setHeader('Content-Type', 'text/plain');
    //     //     res.end(`POST data received: ${requestBody}`);
    //     // });
    }else if (req.method === 'POST') {
        let requestBody = '';
    
        // Listen for incoming data chunks and accumulate them
        req.on('data', (chunk) => {
            requestBody += chunk;
        });
    
        // Once all data has been received, process it
        req.on('end', () => {
            // At this point, the entire request body is in requestBody
            const data = requestBody.toString(); // Convert the buffer to a string
            arr.push(data);
    
            // Send a response
            res.statusCode = 200;
          //  res.setHeader('Content-Type', 'text/plain');
            res.end(`POST request received. Data: ${data}`);
        });
    } else {
        res.statusCode = 405; // Method Not Allowed
        res.setHeader('Content-Type', 'text/plain');
        res.end('Method Not Allowed');
    }
});

module.exports = server;