const {spawn} = require("child_process");
module.exports = (RED => {

    function SentenceTransformer(config) {
        RED.nodes.createNode(this, config);

        let model_id = config.model || 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2';

        let node = this;
        node.on("input",
            ((msg, send, done) => {
                send = send || (() => { node.send.apply(node, arguments) });

                if (msg.terms) {
                    this.status({ fill: 'yellow', shape: 'dot', text: 'Converting...' });

                    const { spawn } = require('child_process')
                    const python = spawn('python', ['C:\\Users\\weser\\PyCharmProjects\\sentenceTransforming\\main.py', model_id, JSON.stringify(msg.terms)]);

                    python.stdout.on('data', (data) => {
                        try {
                            msg.payload = JSON.parse(data.toString());
                        } catch (err) {
                            if (err) {
                                if (done) {
                                    done(err);
                                } else {
                                    node.error(err, msg);
                                }
                            }                        }
                    });

                    python.on('exit', (code) => {
                        if (msg.payload) {
                            this.status({ fill: 'green', shape: 'dot', text: `Received shape(${msg.payload.length}, ${msg.payload[0].length})` });
                            node.send(msg);
                        } else {
                            this.status({ fill: 'red', shape: 'dot', text: `Response undefined, Exit-code: ${code}` });
                        }
                    })


                    /*
                    const tf = require('@tensorflow/tfjs');
                    const use = require('@tensorflow-models/universal-sentence-encoder');


                    use.load().then(model => {
                        this.status({ fill: "yellow", shape: "dot", text: 'converting input' });

                        model.embed(msg.terms).then(embeddings => {
                            this.status({ fill: 'green', shape: 'dot', text: 'finished' });
                            
                            msg.payload = config.raw ? embeddings : embeddings.arraySync();
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
                                node.error(err, msg);
                            }
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