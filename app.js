#!node
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const fs = require('fs');
const mm = require('moment');
const jwt = require('jsonwebtoken');
const skt = require('socket.io-client');
const cors = require('cors');

const { exec } = require('child_process');

// fs.readFile("pwd.txt", function(err, buf) {
//   console.log(buf.toString());
// });

app.use(cors());

const dr = path.join(__dirname + '/html' + '/');

// router.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname+'/html'+'/index.html'));
// });

//--sub-filter marq --marq-marquee "CAM1"

router.get('/api/camstart', (req, res) => {
    let str = `sudo raspivid -o - -t 0 -w 640 -h 360 -fps 25 -rot 90 | cvlc --network-caching=1000 --sout-rtsp-user admin --sout-rtsp-pwd 2222 -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8090/cam}' :demux=h264`;
    //let str = `sudo raspivid -o - -t 0 -w 640 -h 360 -fps 25 -vf | cvlc --network-caching=1000 --sout-http-user=admin --sout-http-pwd=2222 -vvv stream:///dev/stdin --sout '#standard{access=http,mux=ts,dst=:8090/cam}' :demux=h264`;
    exec(str, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log(`node couldn't execute the command START`);
            return;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    res.json({ status: "camstart success" });
});

router.get('/api/camstop', (req, res) => {
    let str_a = `sudo killall -9 raspivid && sudo killall -9 vlc`;
    exec(str_a, (err, stdout, stderr) => {
        if (err) {
            console.log(`node couldn't execute the command sudo killall -9 raspivid`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });

    // let str_b = `sudo killall -9 vlc`;
    // exec(str_b, (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(`node couldn't execute the command sudo killall -9 vlc`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.log(`stderr: ${stderr}`);
    // });
    res.json({ status: "camstop success" });
});

router.get('/api/turnoff', (req, res) => {
    let str = `sudo shutdown -h now`;
    exec(str, (err, stdout, stderr) => {
        if (err) {
            console.log(`node couldn't execute the command sudo shutdown -h now`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    res.json({ status: "turnoff success" });
});

router.get('/api/reboot', (req, res) => {
    let str = `sudo reboot`;
    exec(str, (err, stdout, stderr) => {
        if (err) {
            console.log(`node couldn't execute the command sudo reboot`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    res.json({ status: "reboot success" });
});

router.get('/', (req, res) => {
    res.sendFile(dr + 'index.html');
});

router.get('/gentoken', (req, res) => {
    let token = jwt.sign({
        data: [{ cam: 1, timestamp: '2019-05-06 12:35:17', status: 200 }]
    }, 'secretkey1234', { expiresIn: '1h' }, { algorithm: 'RS512' });
    res.json({ data: token })
});

router.get('/check/:id', (req, res) => {
    // try {
    //   var decoded = jwt.verify(token, 'wrong-secret');
    // } catch(err) {
    // }
    console.log(req.params.id);
    res.json({ status: 'success', data: req.params.id })
});


router.get('/login', (req, res) => {
    res.json({
        status: 200,
        data: [{
            message: 'success',
            datasize: 549,
            timestamp: '2019-05-06 12:35:17',
        }]
    });
});

router.get('/about', (req, res) => {
    res.sendFile(dr + 'about.html');
});

router.get('/sitemap', (req, res) => {
    res.sendFile(dr + 'sitemap.html');
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
