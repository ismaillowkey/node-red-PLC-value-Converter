module.exports = function(RED) {
    function MultiValueConverterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.endianness = config.endianness || "ABCD";
        node.targetType = config.targetType || "int32";
        node.length = parseInt(config.length) || 1;
        if (node.length < 1) {
            node.length = 1;
        }
        node.decimalMode = config.decimalMode || "none";
        node.roundDecimals = parseInt(config.roundDecimals);
        if (isNaN(node.roundDecimals) || node.roundDecimals < 0) {
            node.roundDecimals = 0;
        }

        node.on('input', function(msg, send, done) {
            // Support for Node-RED 1.0+ and backward compatibility
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (!Array.isArray(msg.payload)) {
                    throw new Error("Input msg.payload must be an array of 16-bit integers (Modbus registers)");
                }
                
                const inputRegisters = msg.payload;
                
                // Determine required number of 16-bit registers per value
                let regPerVal = 1;
                switch(node.targetType) {
                    case "int16":
                    case "uint16":
                        regPerVal = 1;
                        break;
                    case "int32":
                    case "uint32":
                    case "float32":
                        regPerVal = 2;
                        break;
                    case "int64":
                    case "uint64":
                    case "double64":
                        regPerVal = 4;
                        break;
                }

                const totalRequired = regPerVal * node.length;

                if (inputRegisters.length < totalRequired) {
                    throw new Error(`Input msg.payload must be an array with at least ${totalRequired} elements`);
                }

                let results = [];

                for (let i = 0; i < node.length; i++) {
                    const sliceStart = i * regPerVal;
                    const registers = inputRegisters.slice(sliceStart, sliceStart + regPerVal);

                    // Create a buffer to hold the bytes
                    let buf = Buffer.alloc(regPerVal * 2);
                    
                    // Write 16-bit registers to buffer depending on Endianness
                    if (regPerVal === 1) {
                        buf.writeUInt16BE(registers[0], 0);
                    } else if (regPerVal === 2) {
                        if (node.endianness === "ABCD") {
                            // Big Endian (ABCD)
                            buf.writeUInt16BE(registers[0], 0);
                            buf.writeUInt16BE(registers[1], 2);
                        } else if (node.endianness === "CDAB") {
                            // Little Endian / Word Swap (CDAB)
                            buf.writeUInt16BE(registers[1], 0);
                            buf.writeUInt16BE(registers[0], 2);
                        }
                    } else if (regPerVal === 4) {
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
                            if (node.decimalMode === "round" && node.roundDecimals >= 0 && Number.isFinite(result)) {
                                result = parseFloat(result.toFixed(node.roundDecimals));
                            }
                            break;
                        case "double64":
                            result = buf.readDoubleBE(0);
                            if (node.decimalMode === "round" && node.roundDecimals >= 0 && Number.isFinite(result)) {
                                result = parseFloat(result.toFixed(node.roundDecimals));
                            }
                            break;
                        case "int64":
                            result = Number(buf.readBigInt64BE(0));
                            break;
                        case "uint64":
                            result = Number(buf.readBigUInt64BE(0));
                            break;
                    }
                    results.push(result);
                }

                // Output 1: Success (array of values)
                msg.payload = results;
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
    
    RED.nodes.registerType("multi-value-converter", MultiValueConverterNode);
}
