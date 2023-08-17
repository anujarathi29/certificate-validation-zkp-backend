pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/sha256/sha256.circom";


template Hasher(){
    signal input recipient_id;
    signal input issuer;
    signal output hash[256];

    component hasher = Sha256(2);
    hasher.in[0] <== recipient_id;
    hasher.in[1] <== issuer;
    for (var i = 0; i<256; i++){
        hash[i] <== hasher.out[i];
    }
}

component main = Hasher();