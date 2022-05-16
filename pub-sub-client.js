const net = require('net')
const clientA = net.connect(1234);
clientA.write("sub_foo");

clientA.on('data', (data) => {
    console.log(`Message: ${data}`);
});

const clientB = net.connect(1234);
clientB.write("pub_foo_Testando");