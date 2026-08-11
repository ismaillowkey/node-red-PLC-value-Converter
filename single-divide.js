module.exports = function(RED) {
    function SingleDivideNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.divisor = parseFloat(config.divisor);
        if (isNaN(node.divisor) || node.divisor === 0) {
            node.divisor = 10; // Default fallback to 10
        }

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node, arguments) };
            done = done || function(err) { if (err) { node.error(err, msg); } };

            try {
                if (msg.payload === null || msg.payload === undefined) {
                    throw new Error("Input msg.payload is missing or null");
                }
                
                let val = Number(msg.payload);
                if (isNaN(val)) {
                    throw new Error("Input msg.payload must be a valid number");
                }
                
                msg.payload = val / node.divisor;
                
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
    
    RED.nodes.registerType("single-divide", SingleDivideNode);
}
