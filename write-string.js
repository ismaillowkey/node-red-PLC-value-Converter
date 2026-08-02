module.exports = function(RED) {
    function WriteStringNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.wordLength = config.wordLength || "2";
        node.endianness = config.endianness || "ABCD";
        node.targetLength = config.targetLength;

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                let str = msg.payload;
                
                if (typeof str !== 'string') {
                    if (str !== null && str !== undefined) {
                        str = String(str);
                    } else {
                        str = "";
                    }
                }

                let outArray = [];
                
                if (node.wordLength === "1") {
                    for (let i = 0; i < str.length; i++) {
                        outArray.push(str.charCodeAt(i) & 0xFFFF);
                    }
                } else {
                    for (let i = 0; i < str.length; i += 2) {
                        let char1 = str.charCodeAt(i) & 0xFF;
                        let char2 = (i + 1 < str.length) ? (str.charCodeAt(i + 1) & 0xFF) : 0; 
                        
                        // Byte Swap
                        let word = 0;
                        if (node.endianness === "BADC" || node.endianness === "DCBA") {
                            word = (char2 << 8) | char1;
                        } else {
                            word = (char1 << 8) | char2;
                        }
                        outArray.push(word);
                    }
                }

                // Word Swap (tukar array per pasangan)
                if (node.endianness === "CDAB" || node.endianness === "DCBA") {
                    for (let i = 0; i < outArray.length - 1; i += 2) {
                        let temp = outArray[i];
                        outArray[i] = outArray[i+1];
                        outArray[i+1] = temp;
                    }
                }

                // Adjust array length based on Target Length
                let tLen = parseInt(node.targetLength);
                if (!isNaN(tLen) && tLen > 0) {
                    // Jika string kepanjangan, potong array-nya
                    if (outArray.length > tLen) {
                        outArray = outArray.slice(0, tLen);
                    }
                    // Jika string kependekan, isi sisa array dengan 0 (null)
                    while (outArray.length < tLen) {
                        outArray.push(0);
                    }
                }

                msg.payload = outArray;
                send([msg, null]);
                done();
            } catch (error) {
                let errorMsg = Object.assign({}, msg);
                errorMsg.payload = error.message;
                
                node.error(error.message, msg);
                
                send([null, errorMsg]);
                done();
            }
        });
    }
    
    RED.nodes.registerType("write-string", WriteStringNode);
}
