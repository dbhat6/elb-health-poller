const AWS = require('aws-sdk');
const { argv } = require('yargs');

const AwsUtils = require('./AwsUtils');
const MiscUtils = require('./MiscUtils');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: argv.accessKey,
  secretAccessKey: argv.secretKey,
});

const elb = new AWS.ELB({ apiVersion: '2012-06-01' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

const option = argv.option || 0;
const port = argv.port || 8080;

const start = async () => {
  let paramsElb = {};
  if (argv.loadBalancer) {
    paramsElb = {
      LoadBalancerName: argv.loadBalancer,
    };
  } else if (argv.dnsName) {
    const elbName = await AwsUtils.getElbDns(elb, argv);

    paramsElb = {
      LoadBalancerName: elbName,
    };
    console.log(paramsElb);
  } else {
    throw new Error('Unknown format');
  }
  const ids = await AwsUtils.getInstanceIDs(elb, paramsElb);

  const paramsEc2 = {};
  paramsEc2.InstanceIds = ids;
  const ips = await AwsUtils.getIpFromEc2(ec2, paramsEc2);
  console.log(ips);

  if (option === 1) MiscUtils.pingIP(ips, port);
};

start();
