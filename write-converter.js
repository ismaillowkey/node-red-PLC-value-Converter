module.exports = function(RED) {
    function WriteConverterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.endianness = config.endianness || "ABCD";
        node.sourceType = config.sourceType || "int32";

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                let value = msg.payload;
                if (typeof value !== 'number' && typeof value !== 'bigint' && typeof value !== 'string') {
                    throw new Error("Input msg.payload must be a number");
                }
                
                // Parse the value according to the type
                if (node.sourceType === "int64" || node.sourceType === "uint64") {
                    value = BigInt(value);
                } else {
                    value = Number(value);
                    if (isNaN(value)) throw new Error("Invalid number input");
                }

                // Determine how many registers we need
                let requiredRegisters = 1;
                switch(node.sourceType) {
                    case "int16":
                    case "uint16":
                        requiredRegisters = 1;
                        break;
                    case "int32":
                    case "uint32":
                    case "float32":
                        requiredRegisters = 2;
                        break;
                    case "int64":
                    case "uint64":
                    case "double64":
                        requiredRegisters = 4;
                        break;
                }

                // Allocate a buffer and write the numeric value into it
                let buf = Buffer.alloc(requiredRegisters * 2);

                switch(node.sourceType) {
                    case "int16":
                        buf.writeInt16BE(value, 0);
                        break;
                    case "uint16":
                        buf.writeUInt16BE(value, 0);
                        break;
                    case "int32":
                        buf.writeInt32BE(value, 0);
                        break;
                    case "uint32":
                        buf.writeUInt32BE(value, 0);
                        break;
                    case "float32":
                        buf.writeFloatBE(value, 0);
                        break;
                    case "double64":
                        buf.writeDoubleBE(value, 0);
                        break;
                    case "int64":
                        buf.writeBigInt64BE(value, 0);
                        break;
                    case "uint64":
                        buf.writeBigUInt64BE(value, 0);
                        break;
                }

                // Split the buffer into an array of 16-bit words based on Endianness
                let outArray = [];
                if (requiredRegisters === 1) {
                    outArray.push(buf.readUInt16BE(0));
                } else if (requiredRegisters === 2) {
                    if (node.endianness === "ABCD") {
                        // Big Endian (ABCD) -> straight read
                        outArray.push(buf.readUInt16BE(0));
                        outArray.push(buf.readUInt16BE(2));
                    } else if (node.endianness === "CDAB") {
                        // Little Endian Word Swap (CDAB)
                        outArray.push(buf.readUInt16BE(2));
                        outArray.push(buf.readUInt16BE(0));
                    }
                } else if (requiredRegisters === 4) {
                    if (node.endianness === "ABCD") {
                        outArray.push(buf.readUInt16BE(0));
                        outArray.push(buf.readUInt16BE(2));
                        outArray.push(buf.readUInt16BE(4));
                        outArray.push(buf.readUInt16BE(6));
                    } else if (node.endianness === "CDAB") {
                        outArray.push(buf.readUInt16BE(2));
                        outArray.push(buf.readUInt16BE(0));
                        outArray.push(buf.readUInt16BE(6));
                        outArray.push(buf.readUInt16BE(4));
                    }
                }

                // Output 1: Success (array of modbus registers)
                msg.payload = outArray;
                send([msg, null]);
                done();

            } catch (error) {
                // Output 2: Error message
                let errorMsg = Object.assign({}, msg);
                errorMsg.payload = error.message;
                
                node.error(error.message, msg);
                
                send([null, errorMsg]);
                done();
            }
        });
    }
    
    RED.nodes.registerType("write-converter", WriteConverterNode);
}
