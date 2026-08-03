module.exports = function(RED) {
    function TimestampToDateNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (msg.payload === undefined || msg.payload === null) {
                    throw new Error("Input msg.payload is missing");
                }
                
                let timestamp = Number(msg.payload);
                if (isNaN(timestamp)) {
                    throw new Error("Input msg.payload must be a valid number (unix timestamp in seconds)");
                }

                // Convert seconds to milliseconds
                const d = new Date(timestamp * 1000);
                
                if (isNaN(d.getTime())) {
                    throw new Error("Invalid date result from timestamp");
                }

                // Format: [YYYY, MM, DD, HH, mm, ss]
                const result = [
                    d.getFullYear(),
                    d.getMonth() + 1, // Month is 0-indexed in JS
                    d.getDate(),
                    d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()
                ];

                msg.payload = result;
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
    
    RED.nodes.registerType("timestamp-to-date", TimestampToDateNode);
}
