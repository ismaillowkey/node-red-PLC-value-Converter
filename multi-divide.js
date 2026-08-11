module.exports = function(RED) {
    function MultiDivideNode(config) {
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
                if (!Array.isArray(msg.payload)) {
                    throw new Error("Input msg.payload must be an array of numbers");
                }
                
                let results = msg.payload.map(function(item, idx) {
                    if (item === null || item === undefined) {
                        throw new Error(`Element at index ${idx} is null or undefined`);
                    }
                    let val = Number(item);
                    if (isNaN(val)) {
                        throw new Error(`Element at index ${idx} is not a valid number`);
                    }
                    return val / node.divisor;
                });
                
                msg.payload = results;
                
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
    
    RED.nodes.registerType("multi-divide", MultiDivideNode);
}
