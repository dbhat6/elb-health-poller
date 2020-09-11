// node pollHealth.js --option=1 --loadBalancer=adherencemedrefillcom --port=8080 ^
// --accessKey=? --secretKey=?
const AWS = require('aws-sdk');
const net = require('net');
const { argv } = require('yargs');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: argv.accessKey,
  secretAccessKey: argv.secretKey,
});

const elb = new AWS.ELB({ apiVersion: '2012-06-01' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

const paramsElb = {
  LoadBalancerName: argv.loadBalancer,
};

const option = argv.option || 0;
const port = argv.port || 8080;

const func = async () => elb
  .describeInstanceHealth(paramsElb, async (err, data) => {
    if (err) {
      throw err;
    } else {
      return data;
    }
  })
  .promise();

const pingIP = (ips) => {
  ips.forEach((ip) => {
    const sock = new net.Socket();
    sock.setTimeout(2500);
    sock
      .on('connect', () => {
        console.log(`${ip}:${port} is up.`);
        sock.destroy();
      })
      .on('error', (e) => {
        console.log(`${ip}:${port} is down: ${e.message}`);
        sock.destroy();
      })
      .on('timeout', () => {
        console.log(`${ip}:${port} is down: timeout`);
        sock.destroy();
      })
      .connect(port, ip);
  });
};

const instances = [];
const machineIPs = [];
const paramsEc2 = {};

func()
  .then((result) => {
    result.InstanceStates.forEach((element) => {
      instances.push(element.InstanceId);
    });

    paramsEc2.InstanceIds = instances;
    ec2.describeInstances(paramsEc2, async (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        data.Reservations.forEach((reservation) => {
          reservation.Instances.forEach((instance) => {
            machineIPs.push(instance.PrivateIpAddress);
          });
        });
        console.log(machineIPs);

        if (option === 1) {
          pingIP(machineIPs);
        }
      }
    });
  })
  .catch((err) => {
    console.log(err, err.stack);
  });
