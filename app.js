var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var express = require('express');
var bodyParser = require('body-parser')
var maintainToneHistory = false;


// The following requires are needed for logging purposes
var uuid = require('uuid');
var workspace="ef365921-0b1a-4aa1-92c7-0f210fc18081";

var app = express();
var router = express.Router();
//var urlencodedparser = bodyParser.urlencoded({extended:false})
var conversation = new ConversationV1({
  username: 'd6a6cd9e-1760-4fa5-83d2-0ab0b1627158',
  password: 'izWEZ7xvSfAQ',
  version_date: ConversationV1.VERSION_DATE_2017_04_21
});


var username = '022458e0-da6a-4dae-83af-a4b7e462f3ae';
var password = '6A2bbgpj4mkh';

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var discovery = new DiscoveryV1({
    username: username,
    password: password,
    version_date: '2016-12-01'
});

var path = __dirname + '/html/';
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});



router.get('/chat_init', function (req, res, next) {
    conversation.message({
    workspace_id: 'ef365921-0b1a-4aa1-92c7-0f210fc18081',
  }, function(err, response) {
     if (err) {
       console.error(err);
     } else {
       res.json(response);
     }
  });
});
app.use("/",router);
app.use( bodyParser.json() );       // to support JSON-encoded bodies 
app.post('/message', function (req, res) {
   
     var payload = {
    workspace_id: workspace,
    context:{},
    input:{}
  }; 
  if (req.body.input) {
      payload.input.text=req.body.input;
    }

    if (req.body.context) {
      payload.context = JSON.parse(req.body.context);
    }

    conversation.message(payload, function(err, response) {
     if (err) {
       console.error(err);
     } else {
    var date=new Array();
    var keyword=new Array();
    if((response.intents[0].confidence*100)>80){
      date_count=0;         
      var intentsz=response.intents[0].confidence;
      
      for (i=0; i<response.entities.length; i++){
        
        if(response.entities[i].entity=='sys-date'){
            date_count=date_count+1;
            date.push(response.entities[i].value);               
        }else{
          keyword.push(response.entities[i].value);
        }

      }
      var search=keyword.toString();
      if(date.length>1){
        search=search+" on ";
        var dt="";
        for(k=0; k<date.length; k++){
          if(k==0){
            dt=dt+date[k];
          }else{
            dt=dt+" between "+date[k];
          }
        }
        search=search+dt;

      }else{
        search=search+" on "+date[0];
      }

      discovery.query({
        environment_id: 'c669cf80-fa0e-4bcc-b2fa-60456a3c648d',
        collection_id: '7538f480-323a-4e82-a29b-d9f39082ba4b',
        query:search,
        
      }, 
        function(err, response1) {
          if (err) {
            console.error(err);
          } else {
          if(response1.matching_results>0){
            res.json(response1);
          }else{
                  res.json(response);

          }
          }
   });


  }else{
      res.json(response);

  }
     }
});

});
app.listen(3000);