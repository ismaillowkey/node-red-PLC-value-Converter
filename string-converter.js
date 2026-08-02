module.exports = function(RED) {
    function StringConverterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.wordLength = config.wordLength || "2";
        node.endianness = config.endianness || "ABCD";
        node.trimNulls = config.trimNulls !== undefined ? config.trimNulls : true;

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (!Array.isArray(msg.payload)) {
                    throw new Error("Input msg.payload must be an array of 16-bit integers");
                }
                
                let registers = msg.payload;
                let str = "";

                // Salin array agar tidak mengubah aslinya
                let words = registers.slice();

                // Word Swap (tukar array per pasangan)
                if (node.endianness === "CDAB" || node.endianness === "DCBA") {
                    for (let i = 0; i < words.length - 1; i += 2) {
                        let temp = words[i];
                        words[i] = words[i+1];
                        words[i+1] = temp;
                    }
                }

                for (let i = 0; i < words.length; i++) {
                    let word = words[i];
                    if (node.wordLength === "1") {
                        str += String.fromCharCode(word & 0xFF); 
                    } else {
                        let char1 = (word >> 8) & 0xFF; // High byte
                        let char2 = word & 0xFF;        // Low byte
                        
                        // Byte Swap (tukar huruf dalam 1 array)
                        if (node.endianness === "BADC" || node.endianness === "DCBA") {
                            str += String.fromCharCode(char2);
                            str += String.fromCharCode(char1);
                        } else {
                            str += String.fromCharCode(char1);
                            str += String.fromCharCode(char2);
                        }
                    }
                }

                // Trim null bytes (\x00) dari depan dan belakang
                if (node.trimNulls) {
                    str = str.replace(/^[\x00]+|[\x00]+$/g, '');
                }

                msg.payload = str;
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
    
    RED.nodes.registerType("string-converter", StringConverterNode);
}
