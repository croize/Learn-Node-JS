var http = require("http");
var url  = require('url');
var qString = require('querystring');
var routes = require('routes')();
var view = require('swig');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    database : "nodejs",
    user : "root",
    password : ""
});

routes.addRoute('/', function (req,res) {

});

routes.addRoute('/buku/create', function (req,res) {
    if(req.method.toUpperCase() == "POST"){
        var data_post = "";
        req.on('data',function (chuncks) {
           data_post += chuncks;
        });
        req.on('end',function () {
            data_post = qString.parse(data_post);
            connection.query("insert into buku set ?",data_post,
                    function (err,field) {
                    if(err) throw err;

                    res.writeHead(302,{"Location" : "/buku"});
                    res.end();
                    }
                );
        });
    }else{
        var  html = view.compileFile('./template/buku/form.html')();
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.end(html);
    }
});
routes.addRoute('/buku/delete/:id', function (req,res) {
    connection.query("delete from buku where ?",{id : this.params.id},
        function (err,fields) {
        if(err) throw err;

        res.writeHead(302, {"Location" : "/buku"});
        res.end();
    });

});
routes.addRoute('/buku/update/:id', function (req,res) {

    connection.query("select * from buku where ?",{ id : this.params.id },
        function (err,rows,field) {
            if(rows.length){
                var data = rows[0];
                if(req.method.toUpperCase()== "POST"){
                    var data_post = "";
                    req.on('data', function (chucks) {
                        data_post += chucks;
                    });
                    req.on('end',function () {
                       data_post = qString.parse(data_post);
                        connection.query("update buku set ? where ?",[
                            data_post,
                            { id : data.id }
                         ],function (err,fields) {
                         if(err) throw err;

                         res.writeHead(302, {"Location" : "/buku"});
                         res.end();
                         }
                        );
                    });
                }else{
                    var  html = view.compileFile('./template/buku/form_update.html')({
                        data : data
                    });
                    res.writeHead(200, {"Content-Type" : "text/html"});
                    res.end(html);
                }
            }else{
                var html = view.compileFile("./template/404.html")();
                res.writeHead(404,{"Content-Type" : "text/html"});
                res.end(html);
            }
        }

    );
});

routes.addRoute('/buku', function (req,res) {
    connection.query("select * from buku",function (err,rows,field) {
        if(err) throw err;
        var  html = view.compileFile('./template/buku/index.html')({
            data : rows,
        });
        res.writeHead(200,{"Content-Type" : "text/html"});
        res.end(html);
    });

});

routes.addRoute('/siswa', function (req,res) {
    connection.query("select * from siswa",function(err,rows,field){
      if(err) throw err;
      var html = view.compileFile('./template/siswa/index.html')({
        data : rows,
      });
      res.writeHead(200,{"Content-Type" : "text/html"});
      res.end(html);
    });
});

routes.addRoute('/siswa/create', function (req,res) {
  if(req.method.toUpperCase() == "POST"){
    var data_post = "";
    req.on('data',function(chuncks){
      data_post += chuncks;
    });
    req.on('end',function(){
      data_post = qString.parse(data_post);
      connection.query("insert into siswa set ?",data_post,
        function(err,field){
          if(err) throw err;
          res.writeHead(302,{"Location" : "/siswa"});
          res.end();
        }
      );
    });
  }else{
    var  html = view.compileFile('./template/siswa/form.html')();
    res.writeHead(200, {"Content-Type" : "text/html"});
    res.end(html);
  }
});

routes.addRoute('/siswa/update/:nisn', function(req,res){
  connection.query("select * from siswa where ?",{nisn : this.params.nisn},
    function(err,rows,field){
      if(rows.length){
        var data = rows[0];
        if(req.method.toUpperCase()=="POST"){
          var data_post = "";
          req.on('data', function(ass){
            data_post += ass;
          });
          req.on('end', function(){
            data_post = qString.parse(data_post);
            connection.query("update siswa set ? where ?",[
              data_post,
              {nisn : data.nisn}
            ], function(err,fields){
              if(err) throw err;
              res.writeHead(302,{"Location" : "/siswa"});
              res.end();
              }
            );
          });
        }else{
          var  html = view.compileFile('./template/siswa/form_update.html')({
              data : data,
          });
          res.writeHead(200, {"Content-Type" : "text/html"});
          res.end(html);
        }
      }else{
        var html = view.compileFile("./template/404.html")();
        res.writeHead(404,{"Content-Type" : "text/html"});
        res.end(html);
      }
    }
  );
});
routes.addRoute('/siswa/delete/:nisn', function(req,res){
  connection.query("delete from siswa where ?",{nisn : this.params.nisn},
      function (err,fields) {
      if(err) throw err;

      res.writeHead(302, {"Location" : "/siswa"});
      res.end();
  });
});

// req : request , res : respond

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var match = routes.match(path);
    if(match){
        match.fn(req, res);
    }else{
        var html = view.compileFile("./template/404.html")();
        res.writeHead(404,{"Content-Type" : "text/html"});
        res.end(html);
    }
}).listen(8888);
console.log("Server is running..")
