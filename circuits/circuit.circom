pragma circom 2.0.6;

include "../node_modules/circomlib/circuits/poseidon.circom";


template Hasher(){
    signal input recipient_id;
    signal input issuer_id;
    signal output hash;
    
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== recipient_id;
    poseidon.inputs[1] <== issuer_id;
    hash <== poseidon.out; 

}

component main = Hasher();