module.exports = function(RED) {
    function DateToTimestampNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (!Array.isArray(msg.payload) || msg.payload.length < 6) {
                    throw new Error("Input msg.payload must be an array of at least 6 numbers: [YYYY, MM, DD, HH, mm, ss]");
                }
                
                const year = Number(msg.payload[0]);
                const month = Number(msg.payload[1]) - 1; // JS months are 0-indexed
                const day = Number(msg.payload[2]);
                const hours = Number(msg.payload[3]);
                const minutes = Number(msg.payload[4]);
                const seconds = Number(msg.payload[5]);

                if ([year, month, day, hours, minutes, seconds].some(isNaN)) {
                    throw new Error("All 6 elements in the array must be valid numbers");
                }

                const d = new Date(year, month, day, hours, minutes, seconds);
                
                if (isNaN(d.getTime())) {
                    throw new Error("Invalid date result from the provided array");
                }

                // Output as Unix timestamp in seconds
                msg.payload = Math.floor(d.getTime() / 1000);
                
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
    
    RED.nodes.registerType("date-to-timestamp", DateToTimestampNode);
}
