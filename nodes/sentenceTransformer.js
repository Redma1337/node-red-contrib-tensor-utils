const { spawn } = require("child_process");
const path = require("path");

module.exports = (RED => {

    function SentenceTransformer(config) {
        RED.nodes.createNode(this, config);

        let node = this;
        node.on("input",
            ((msg, send, done) => {
                send = send || (() => { node.send.apply(node, arguments) });


                if (msg.terms) {
                    this.status({ fill: 'yellow', shape: 'dot', text: 'Converting...' });

                    const { spawn } = require('child_process')
                    const python = spawn('python', [path.join(__dirname, '..', 'core', 'main.py'), JSON.stringify(msg.terms)]);

                    console.log('Args', [path.join(__dirname, '..', 'core', 'main.py'), JSON.stringify(msg.terms)])
                    python.stdout.on('data', (data) => {
                        try {
                            msg.payload = JSON.parse(data.toString());
                        } catch (err) {
                            console.log(data);
                        }
                    });

                    python.on('exit', (code) => {
                        if (Array.isArray(msg.payload)) {
                            this.status({ fill: 'green', shape: 'dot', text: `Received shape(${msg.payload.length}, ${msg.payload[0].length})` });
                            node.send(msg);
                        } else {
                            this.status({ fill: 'red', shape: 'dot', text: `Response undefined, Exit-code: ${code}` });
                        }
                    })


                    /*
                    const tf = require('@tensorflow/tfjs');
                    const use = require('@tensorflow-models/universal-sentence-encoder');


                    use.load().then(paraphrase-multilingual-MiniLM-L12-v2 => {
                        this.status({ fill: "yellow", shape: "dot", text: 'converting input' });

                        paraphrase-multilingual-MiniLM-L12-v2.embed(msg.terms).then(embeddings => {
                            this.status({ fill: 'green', shape: 'dot', text: 'finished' });
                            
                            msg.payload = config.raw ? embeddings : embeddings.arraySync();
                                node.error(err, msg);
                            }
                            node.send(msg);
                        }).catch(err => {
                            this.status({ fill: 'red', shape: 'dot', text: err.message });

                            if (err) {
                                if (done) {
                                    done(err);
                                } else {
                                    node.error(err, msg);
                                }
                            }
                        });

                    }).catch(err => {
                        this.status({ fill: 'red', shape: 'dot', text: err.message });

                        if (err) {
                            if (done) {
                                done(err);
                            } else {
                        }
                    });
                    */
                } else {
                    this.status({ fill: 'yellow', shape: 'dot', text: 'missing input' });

                    if (done) {
                        done("Please provide msg.terms as array of input");
                    } else {
                        node.error("Please provide msg.terms as array of input", msg);
                    }
                }
            })
        );
    }

    RED.nodes.registerType("sentence transformer", SentenceTransformer);
});