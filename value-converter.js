module.exports = function(RED) {
    function ValueConverterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.endianness = config.endianness || "ABCD";
        node.targetType = config.targetType || "int32";

        node.on('input', function(msg, send, done) {
            // Support for Node-RED 1.0+ and backward compatibility
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (!Array.isArray(msg.payload)) {
                    throw new Error("Input msg.payload must be an array of 16-bit integers (Modbus registers)");
                }
                
                const registers = msg.payload;
                
                // Determine required number of 16-bit registers
                let requiredRegisters = 1;
                switch(node.targetType) {
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

                if (registers.length < requiredRegisters) {
                    throw new Error(`Requires at least ${requiredRegisters} registers for ${node.targetType}, but received ${registers.length}`);
                }

                // Create a buffer to hold the bytes
                let buf = Buffer.alloc(requiredRegisters * 2);
                
                // Write 16-bit registers to buffer depending on Endianness
                if (requiredRegisters === 1) {
                    buf.writeUInt16BE(registers[0], 0);
                } else if (requiredRegisters === 2) {
                    if (node.endianness === "ABCD") {
                        // Big Endian (ABCD)
                        buf.writeUInt16BE(registers[0], 0);
                        buf.writeUInt16BE(registers[1], 2);
                    } else if (node.endianness === "CDAB") {
                        // Little Endian / Word Swap (CDAB)
                        buf.writeUInt16BE(registers[1], 0);
                        buf.writeUInt16BE(registers[0], 2);
                    }
                } else if (requiredRegisters === 4) {
                    if (node.endianness === "ABCD") {
                        // Big Endian (ABCD)
                        buf.writeUInt16BE(registers[0], 0);
                        buf.writeUInt16BE(registers[1], 2);
                        buf.writeUInt16BE(registers[2], 4);
                        buf.writeUInt16BE(registers[3], 6);
                    } else if (node.endianness === "CDAB") {
                        // Little Endian / Word Swap for 4 words
                        buf.writeUInt16BE(registers[1], 0);
                        buf.writeUInt16BE(registers[0], 2);
                        buf.writeUInt16BE(registers[3], 4);
                        buf.writeUInt16BE(registers[2], 6);
                    }
                }

                // Read value from buffer based on targetType
                let result;
                switch(node.targetType) {
                    case "int16":
                        result = buf.readInt16BE(0);
                        break;
                    case "uint16":
                        result = buf.readUInt16BE(0);
                        break;
                    case "int32":
                        result = buf.readInt32BE(0);
                        break;
                    case "uint32":
                        result = buf.readUInt32BE(0);
                        break;
                    case "float32":
                        result = buf.readFloatBE(0);
                        break;
                    case "double64":
                        result = buf.readDoubleBE(0);
                        break;
                    case "int64":
                        // Number is used to convert BigInt to standard JavaScript number representation (safe up to 2^53 - 1)
                        result = Number(buf.readBigInt64BE(0));
                        break;
                    case "uint64":
                        result = Number(buf.readBigUInt64BE(0));
                        break;
                }

                // Output 1: Success
                msg.payload = result;
                send([msg, null]);
                done();

            } catch (error) {
                // Output 2: Error message
                let errorMsg = Object.assign({}, msg);
                errorMsg.payload = error.message;
                
                // Also log to Node-RED debug tab
                node.error(error.message, msg);
                
                send([null, errorMsg]);
                done();
            }
        });
    }
    
    RED.nodes.registerType("value-converter", ValueConverterNode);
}
