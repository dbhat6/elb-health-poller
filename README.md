# elb-health-poller

This is a simple project created which can be used to fetch individual machine IPs behind an *AWS ELB*, and if required, do health checks on the port wanted to see if those machines are up.

## Installation

*To clone it -*
```
git clone https://github.com/dbhat6/elb-health-poller.git   
```
*To install it -*
```
cd elb-health-poller   
npm i
```

## Usage

*To run it -*
```
node pollHealth.js --option=1 --loadBalancer=? --port=? --accessKey=? --secretKey=?
```
* option tag has two modes (Defaults to 0) -  
0 - Just fetches the IPs  
1 - Fetches the IPs and also hits the port mentioned as the command line argument 
* loadBalancer is the name of the load balancer to be checked
* port is which port to perform health checks on (Defaults to 8080) 
* accessKey is your user's access key for the AWS account
* secretKey is your user's secret key for the AWS account