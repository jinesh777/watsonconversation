var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var express = require('express');
var bodyParser = require('body-parser')
var maintainToneHistory = false;
// The following requires are needed for logging purposes
var workspace="<WorkSpaceid>";

var app = express();
var router = express.Router();
//var urlencodedparser = bodyParser.urlencoded({extended:false})
var conversation = new ConversationV1({
  username: '<username>',
  password: '<password>',
  version_date: ConversationV1.VERSION_DATE_2017_04_21
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
      res.json(response);

  }
     }
});

});
app.listen(3000);
