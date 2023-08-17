const express = require('express')
//const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const snarkjs = require('snarkjs')
const fs = require('fs')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.post("/prover",(req,res)=>{
    var data = req.body

    async function run(){
        const {proof,publicSignals} = await snarkjs.groth16.fullProve({recipient_id:data.recipient_id,issuer: data.issuer}, "./circuits/circuit_js/circuit.wasm","./circuits/circuit_final.zkey")
        console.log("Proof: ")
        console.log(JSON.stringify(proof,null,1));

        const vKey = JSON.parse(fs.readFileSync("./circuits/verification_key.json"))

        const result = await snarkjs.groth16.verify(vKey,publicSignals,proof)
        if(result === true){
            console.log("verification OK");
            res.send({msg: "True"})            
        } else{
            console.log("Invalid proof");
            res.send({msg: "False"})            
        }
    }

    run().then(()=>{
        process.exit(0);
    })
})

app.listen(8000,()=>{
    console.log("Server started and running at port: 8000");
})