var cluster = require('cluster');


module.exports = function ruCluster(app) {
  if(cluster.isMaster) {
    cluster.fork();
    cluster.fork();

    cluster.on('disconnect', function (worker) {
      console.error(worker);
      cluster.fork();
    });
  } else {
    var d = require('domain').create();

    d.on('error', function (err) {
      console.error(err.message);
    });

    d.run(function () {
      app.listen(1337, function () {
        console.info('listen http://localhost:1337');
      });
    });
  }
}
