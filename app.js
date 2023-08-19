const express = require("express")
const bodyParser = require("body-parser")
const snarkjs = require('snarkjs')
const fs = require('fs')
const app = express()

const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/certificatedb")
    .then(() => console.log("Connected to the database"))
    .catch(err => console.log("Failed to connect to Database", err))

const CertificateSchema = mongoose.Schema({
    recipient_id: Number,
    recipient_name: String,
    email: String,
    phoneNumber: String,
    grade: String,
    issuer_id: Number,
    issuer_name: String,
    proof: Object,
    publicSignals: Object
},
    {
        timestamps: true
    });

const Certificate = mongoose.model('Certificate', CertificateSchema);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

async function getData(data) {
    var dbData = await Certificate.find({ "recipient_id": { $eq: data.recipient_id } })
    return dbData
}


async function generateProof(data) {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({ recipient_id: data.recipient_id, issuer_id: data.issuer_id }, "./circuits/circuit_js/circuit.wasm", "./circuits/circuit_final.zkey")
    Certificate
        .create({
            "recipient_id": data.recipient_id, "recipient_name": data.recipient_name, "email": data.email,
            "phoneNumber": data.phoneNumber, "grade": data.grade, "issuer_id": data.issuer_id, "issuer_name": data.issuer_name, "proof": proof, "publicSignals": publicSignals
        })
        .then(status => {
            console.log("Got the data");
        })
        .catch(err => {
            console.log("Error while saving: ", err);
        })
    return { proof, publicSignals }
}


app.post("/prover", async (req, res) => {
    var data = req.body
    let proofdata = {}
    let pubSignals = {}
    var dbData = await getData(data)

    if (dbData.length > 0) {
        proofdata = await dbData[0].proof
        pubSignals = await dbData[0].publicSignals
    } else {

        let { proof, publicSignals } = await generateProof(data)
        proofdata = proof
        pubSignals = publicSignals
    }
    var encoded = btoa(JSON.stringify({ proofdata, pubSignals }))
    res.send({ proof: encoded })
})

app.post("/verifier", async (req, res) => {
    try {
        var data = req.body
        console.log("data recieved: ", data);
        console.log("Proof: ", data.proof);
        var decoded = JSON.parse(atob(data.proof))
        console.log("Decoded: ", decoded);
        const vKey = JSON.parse(fs.readFileSync("./circuits/verification_key.json"))
        const result = await snarkjs.groth16.verify(vKey, decoded.pubSignals, decoded.proofdata)
        if (result === true) {
            console.log("Verification OK");
            res.send({ msg: "Proof is valid" })
        }
    } catch (err) {
        res.send({ msg: "Proof is Invalid" })
        console.log("Error:", err);
    }
})

app.listen(8000, function () {
    console.log("Server running at 8000")
})

//Code, implementation and testing done by Anuja Rathi. Please contact anujarathi2@gmail.com for any query.