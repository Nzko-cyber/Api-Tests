import pactum from "pactum";

pactum.request.setBaseUrl('https://phoenix-dev.datamicron.com/api');
pactum.request.setDefaultTimeout(10000);

pactum.request.setDefaultHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

console.log('PactumJS Global Configuration Loaded');
