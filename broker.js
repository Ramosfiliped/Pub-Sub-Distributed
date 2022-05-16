const net = require('net');
const path = require('path');

const PORT = 1234;
const logs  = [];
const broker = net.createServer().listen(PORT, () => {
    console.log(`PubSub Server inicialized on port ${PORT}`);
});

const obj = [0, 0, 0, 0, 0, 0 ,0];

const listeningChannels = [];

function subscribe(channel, socket){
    if(!listeningChannels[channel]){
        listeningChannels[channel] = [];
        logs[channel] = [];
    }

    console.log(`Subscribing to channel ${channel}`);
    listeningChannels[channel].push(socket);
}

function publish(channel, message){
    if(!listeningChannels[channel]) return;

    lastIndex = logs[channel].length;
    logs[channel].push([lastIndex , message]);
    for(const socket of listeningChannels[channel])
        socket.write('Log Modified');
    
    return lastIndex;
}

const regexes = {
    sub: /^sub_(.*)$/,
    pub: /^pub_(.*)_(.*)$/
};

broker.on('connection', (socket) => {
    console.log('A new socket were connected');
    socket.on('data', (data) => {
        const msg = data.toString();
        const matchSub = msg.match(regexes.sub);
        if(matchSub && matchSub[1]){
            const channel = matchSub[1];
            subscribe(channel, socket);
            return;
        }

        const matchPub = msg.match(regexes.pub);
        if(matchPub && matchPub[1]){
            const channel = matchPub[1];
            const message = matchPub[2];
            
            indexMyAdquire = publish(channel, 'adquire');
            lock = canUseTheArray(channel, indexMyAdquire);;
            while(!lock){
                setTimeOut(() => {
                   lock = canUseTheArray(channel, indexMyAdquire);
                }, 1000);
            }

            for(let i = 0; i < obj.length; i++){
                if(!obj[i] === 0){
                    obj[i] = message;
                }
            }

            indexMyAdquire = publish(channel, 'release');
            return;
        }

        console.error(new Error(`Unknown command ${msg}`));
    });
});

function canUseTheArray(channel, indexAdquire){
    numberOfReleases = 0;
    numberOfAdquire  = 0; 
    console.log(logs[channel].length)
    for(let i = 0; i < logs[channel].length; i++){
        let data = logs[channel][i];
        if (data[1] === 'release') numberOfReleases++;
    }

    for(let i = 0; i <= indexAdquire; i++){
        let data = logs[channel][i];
        if(data[1] === 'adquire') numberOfAdquire++;
    }
    return (numberOfAdquire-1 == numberOfReleases);
}