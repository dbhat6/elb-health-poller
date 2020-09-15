const elbDescInstances = (elb, paramsElb) => {
  return new Promise((resolve, reject) => {
    elb.describeInstanceHealth(paramsElb, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const elbDescLoadBalancers = (elb, paramsElb) => {
  return new Promise((resolve, reject) => {
    elb.describeLoadBalancers(paramsElb, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const ec2DescribeInstances = (ec2, paramsEc2) => {
  return new Promise((resolve, reject) => {
    ec2.describeInstances(paramsEc2, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getElbDns = async (elb, params) => {
  const emptyParams = {};
  const result = await elbDescLoadBalancers(elb, emptyParams);

  const elbInstance = result.LoadBalancerDescriptions.filter(
    (singleElb) => singleElb.DNSName === params.dnsName,
  );

  return elbInstance[0].LoadBalancerName;
};

const getInstanceIDs = async (elb, paramsElb) => {
  const result = await elbDescInstances(elb, paramsElb);

  const instances = [];
  result.InstanceStates.forEach((element) => {
    instances.push(element.InstanceId);
  });

  return instances;
};

const getIpFromEc2 = async (ec2, paramsEc2) => {
  const result = await ec2DescribeInstances(ec2, paramsEc2);

  const machineIPs = [];
  result.Reservations.forEach((reservation) => {
    reservation.Instances.forEach((instance) => {
      machineIPs.push(instance.PrivateIpAddress);
    });
  });

  return machineIPs;
};

module.exports = { getInstanceIDs, getIpFromEc2, getElbDns };
