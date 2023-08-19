# Internship Assignment Task: Certificate Verification - Using Zero Knowledge Proof (Backend)

## Dependencies

1. Nodejs
2. Mongodb 
3. Expressjs and Mongoose
3. snarkjs and circomlib


## Explanation of the backend and flow of the application

The purpose of zero knowledge proof implementation in the certificate validation as mentioned in the problem statememnt was to verify the credentials of a prover without sharing any credentials with the verifier.

I have implemented this using circom and snarkjs. 

* Circom and snarkjs are used to implement ZKP using zk-SNARKs (zero-knowledge succinct non-interactive arguments of knowledge).

* Circom is a domain-specific language (DSL) for specifying arithmetic circuits. It allows you to define the structure and behavior of circuits that can be used in zero-knowledge proofs.

* Snarkjs is a JavaScript library that provides tools for working with zk-SNARKs. It allows you to compile Circom circuits into zk-SNARKs, generate proofs, and verify them. Snarkjs also provides utilities for key generation, circuit optimization, and other operations related to zk-SNARKs.

Steps mentioned below of the implementation of circom and snarkjs.

```
1. Define the Circuit: Create a Circom file (.circom) that defines the arithmetic circuit for certificate validation. This involves specifying the inputs, outputs, and constraints of the circuit.
2. Compile the Circuit: Use the Circom compiler to generate the R1CS (Rank-1 Constraint System) file and the WASM (WebAssembly) file from the Circom file.
3. Generate the Parameters: Initialize the parameters for the zk-SNARKs by running the trusted setup ceremony. This involves performing a multi-party computation to generate the proving and verifying keys.
4. Verify the Parameters: Verify the integrity of the parameters generated in the previous step.
5. Use WASM and R1CS files to generate proof and verify the proofs.
```

## Explanation of Backend and flow of the application

__Once the dependencies are installed, you can use following instructions to run the application__

1. Clone the project:

```sh
git clone https://github.com/anujarathi29/certificate-validation-zkp-backend.git
```

2. Start mongo service:

```sh
sudo service mongod start
```


```sh
cd back-end
nodemon app.js
```
# API

## `/prover`
#### Expected payload
    {
        "recipient_id": Number,
        "recipient_name": String,
        "email": String,
        "phoneNumber": String,
        "grade": String,
        "issuer_id": Number,
        "issuer_name": String,
    }
#### Expected response
    {
	    "proof": {
            <generated proof>
        }
    }

## `/verifier`
#### Expected payload
    {
        "proof": String,
    }
#### Expected response
    {
	    "Status": {
            <Verification Status>
        }
    }
