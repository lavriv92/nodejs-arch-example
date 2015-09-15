var cluster = require('cluster');


module.exports = (app) => {
  if(cluster.isMaster) {
    cluster.fork();
    cluster.fork();

    cluster.on('disconnect', (worker) => {
      console.error(worker);
      cluster.fork();
    });
  } else {
    var d = require('domain').create();

    d.on('error', (err) => {
      console.error(err.message);
    });

    d.run(function () {
      app.listen(1337, () => {
        console.info('listen http://localhost:1337');
      });
    });
  }
}
