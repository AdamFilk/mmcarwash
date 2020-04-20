'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()), // creates express http server
  ejs = require("ejs");
 const firebase = require("firebase-admin");
  

  const pageaccesstoken = 'EAAKGyWXj6KABAB4s5bmcCuMvrdpKW1S0fnoYezGNAtA022SiQZAOwTBeng7cjs79hPYl3pknZCTGWDPPIhBqsKOZAokIGEpjqtFT4AqV6yaZAZBPYtS5VmUsDayUVkZCloQRipJouy3ReZBfUkonLYwH8TO1BXTHVxBu1aTbKIpZB1O4kZC9e7QCXMtJNdfC0MXkZD';
  
var firebaseConfig = {
     credential: firebase.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.FIREBASE_PROJECT_ID,    
    }),
    databaseURL: process.env.FIREBASE_DB_URL, 
  };



firebase.initializeApp(firebaseConfig);

let db = firebase.firestore(); 

  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.get('/whitelists',function(req,res){    
  whitelistDomains(res);
});


app.get('/b_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('b_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})

app.get('/s_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('s_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})

app.get('/prm_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('prm_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})

})
app.get('/cc_book/:package/:name/:id', (req, res) => {

  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('cc_book.ejs', {name:name, package:washpackage,id:senderID})
  
})
app.get('/wax_book/:package/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('wax_book.ejs', {name:name, package:washpackage,id:senderID})
  
})
app.get('/sealant_book/:package/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('sealant_book.ejs', {name:name, package:washpackage,id:senderID})
  
})
app.get('/rim_book/:package/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('rim_book.ejs', {name:name, package:washpackage,id:senderID})
  
})
app.get('/egbay_book/:package/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('egbay_book.ejs', {name:name, package:washpackage,id:senderID})
  
})
app.get('/headres_book/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var senderID=req.params.id;
  res.render('headres_book.ejs', {name:name, package:washpackage,id:senderID})
})
app.get('/wash/:params/:name', (req, res) => {
  var name = req.params.name;
  var date = new Date();
  var time = `${date.getHours}:${date.getMinutes}:${date.getSeconds}`
  date = `${date.getDate}/${date.getMonth+1}/${date.getFullYear}`
  var link = req.params.params
  var usersettings = link.split('_')
  if(link.includes('wl_') || link.includes('hw_')){
    var washtype = usersettings[0];
    var water = usersettings[1];
    var mode = usersettings[2];
    var carsize = usersettings[3] 
  }else{
    var washtype = 'wl';
    var water = usersettings[0];
    var mode = usersettings[1];
    var carsize = usersettings[2]
  }
  res.render('index', {name: name, washtype: washtype, water: water, mode: mode, carsize: carsize, date: date, time: time})
})
let userOrder = {};
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "aungchanoo"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log("WEB HOOK EVENT", webhook_event);


        if(webhook_event.message){
          var userInput = webhook_event.message.text;
          
        }
        
        if(webhook_event.postback){
          var userInput = webhook_event.postback.payload
        }
        if (userInput == 'Hi'){
          requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
            var udetails = JSON.parse(success.body)
          let welcomeMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text":"Hi!"+" "+udetails.name+" "+"Welcome from MM Car Wash 😄😄😄"
            }
          };
          let genericMessage = {
            "recipient":{
              "id": webhook_event.sender.id
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                    {
                    "title":"MM Carwash's Chatbot",
                    "subtitle":"Enjoy our fast and reliable service!",
                    "image_url":"https://i.pinimg.com/originals/8e/ae/4e/8eae4e9c738013ac5bef63b8cbf9a328.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Start Booking",
                        "payload":"sb"
                      },
                      {
                        "type":"postback",
                        "title":"Prices",
                        "payload":"price"
                      },
                      {
                        "type":"postback",
                        "title":"View My Appointment",
                        "payload":"view_apn"
                      },

                    ]
  
                  },
                  {
                    "title":"MM Carwash",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"About",
                        "payload":"ab"
                      },
                      {
                        "type":"postback",
                        "title":"Contact",
                        "payload":"con"
                      },
                      {
                        "type":"postback",
                        "title":"Report Bug",
                        "payload":"rp"
                      },

                    ]
  
                  },
                ],
                
                }
              }
  
            }
          }
          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
          welcomeMessage
          ).then(response=>{
            console.log(response)
          }).fail(error=> {
            console.log(error)
          })
          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
          genericMessage
          ).then(response=>{
            console.log(response)
          }).fail(error=> {
            console.log(error)
          })
        }).catch(error=>{
          console.log(error)
        })
        
        }
        //end of select
       //start of book
       if (userInput == 'sb'){

        let genericMessage = {
          "recipient":{
            "id": webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                  "title":"Our services:",
                  "subtitle":"choose one",
                  "image_url":"https://i.pinimg.com/originals/4e/2e/bc/4e2ebcc3e908aa9bef55fa6667048eca.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Book Car wash",
                      "payload":"cw"
                    },
                    {
                      "type":"postback",
                      "title":"Book Packages",
                      "payload":"cwpkg"
                    },
                    {
                      "type":"postback",
                      "title":"Single add-on services",
                      "payload":"cds"
                    },
                  ]

                },
              ],
              
              }
            }

          }
        }
        requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
      genericMessage
      ).then(response=>{
        console.log(response)
      }).fail(error=> {
        console.log(error)
      })
    
      }
       //end of select
//start of car wash
if (userInput== "cw"){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Okay! Let’s get that dirty car washed!"
    }
  };
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
            "title":"Please choose size of the car",
            "buttons":[
              {
                "type":"postback",
                "title":"Small",
                "payload":"sm"
              },
              {
                "type":"postback",
                "title":"Medium",
                "payload":"md"
              },
              {
                "type":"postback",
                "title":"Large",
                "payload":"lg"
              },
            ]
          },
              
        ]
      }
    }
  }
}
requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}
//start car size
//start sm,md,lg
if (userInput == 'sm' || userInput == 'md' || userInput == 'lg'){

  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
            "title":"Select one:",
            "buttons":[
              {
                "type":"postback",
                "title":"Interior",
                "payload":`int_${userInput}`
              },
              {
                "type":"postback",
                "title":"Exterior",
                "payload":`s_${userInput}`
              },
              {
                "type":"postback",
                "title":"Both",
                "payload":`both_${userInput}`
              },
            ]
          },
          
          
              
        ]
      }
    }
  }
}

  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}
//end sm,md,lg
//end of car size
//start 
if (userInput == 'int_sm'|| userInput == 'ext_sm' || userInput == 'both_sm' || userInput == 'int_md'|| userInput == 'ext_md' || userInput == 'both_md' || userInput == 'int_lg'|| userInput == 'ext_lg' || userInput == 'both_lg'){
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
              "title":"Can you Provide water?",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":`y_${userInput}`
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":`n_${userInput}`
                }
            ]
          },
        ]
      }
    }
  }
}
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
} 
//end
if (userInput == 'y_int_sm'|| userInput == 'y_ext_sm' || userInput == 'y_both_sm' || userInput == 'y_int_md'|| userInput == 'y_ext_md' || userInput == 'y_both_md' || userInput == 'y_int_lg'|| userInput == 'y_ext_lg' || userInput == 'y_both_lg' || userInput == 'n_int_sm'|| userInput == 'n_ext_sm' || userInput == 'n_both_sm' || userInput == 'n_int_md'|| userInput == 'n_ext_md' || userInput == 'n_both_md' || userInput == 'n_int_lg'|| userInput == 'n_ext_lg' || userInput == 'n_both_lg'){
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
              "title":"provide water",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Waterless wash",
                        "payload":`wl_${userInput}`
                      },
                      {
                        "type":"postback",
                        "title":"Regular wash",
                        "payload":`hw_${userInput}`
                      }
            ]
          },
        ]
      }
    }
  }
}
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
} 
if (userInput == 'wl_y_int_sm'|| userInput == 'wl_y_ext_sm' || userInput == 'wl_y_both_sm' || userInput == 'wl_y_int_md'|| userInput == 'wl_y_ext_md' || userInput == 'wl_y_both_md' || userInput == 'wl_y_int_lg'|| userInput == 'wl_y_ext_lg' || userInput == 'wl_y_both_lg' || userInput == 'n_int_sm'|| userInput == 'n_ext_sm' || userInput == 'n_both_sm' || userInput == 'n_int_md'|| userInput == 'n_ext_md' || userInput == 'n_both_md' || userInput == 'n_int_lg'|| userInput == 'n_ext_lg' || userInput == 'n_both_lg' || userInput == 'hw_y_int_sm'|| userInput == 'hw_y_ext_sm' || userInput == 'hw_y_both_sm' || userInput == 'hw_y_int_md'|| userInput == 'hw_y_ext_md' || userInput == 'hw_y_both_md' || userInput == 'hw_y_int_lg'|| userInput == 'hw_y_ext_lg' || userInput == 'hw_y_both_lg'){
  var userName = [] 
  requestify.get(`https://graph.facebook.com/<PSID>?fields=first_name,last_name&access_token=${pageaccesstoken}`).then(success=>{
    response = success.getBody();
    userName.push(response.last_name)
    userName.unshift(response.first_name) 
   })
  if(userInput.includes('wl_')){
    var text = '' //waterless
    var image = '' //waterless
    var rollback = userInput.split('_')
  rollback.shift()
  rollback = rollback.join('_')
  }else if(userInput.includes('hw_')){
    var text = '' //handwash
    var image = '' //handwash
    var rollback = userInput.split('_')
  rollback.shift()
  rollback = rollback.join('_')
  }else {
    var text = '' //waterless
    var image = '' //waterless
    var rollback = userInput.split('_')
  rollback.shift()
  rollback = rollback.join('_')
  }

  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": text
    }
  };
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
              "title":"provide water",
                "buttons":[
                    {
                      "type":"web_url",
                      "title":"Yes",
                      "url": `mmcarwash.herokuapp.com/wash/${userInput}/${userName.join(' ')}`,
                      "webview_height_ratio":"tall"
                      },
                      {
                      "type":"postback",
                      "title":"No",
                      "payload":`${rollback}`
                      }
                    ]
  
                  }
                ]
                }
              }
            }
          }
                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
                textMessage
                ).then(response=>{
                  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
                    genericMessage
                  )
                }).fail(error=> {
                  console.log(error)
                })
                  //end of choose one
              }
            
//end of car wash
      //start of  packages
      if (userInput== "cwpkg"){
        let genericMessage = {
          "recipient":{
            "id": webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                  "title":"Basic Wash Package",
                  "subtitle":"Carsize:\nSmall=6000Ks\nMedium=8000Ks\nLarge=10000Ks",
                  "image_url":"https://i.pinimg.com/originals/1d/2e/0c/1d2e0ca0da9badd9e5c705a106797c09.png",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Book Basic package",
                      "payload":userInput+"/basic"
                    },
                  ]
  
                },
                {
                  "title":"Standard Wash Package",
                  "subtitle":"Carsize:\nSmall=8000Ks\nMedium=10000Ks\nLarge=12000Ks",
                  "image_url":"https://i.pinimg.com/originals/e4/7c/f5/e47cf5bf53908e2864287ff7a09727c8.png",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Book Standard package",
                      "payload":userInput+"/st"
                    },
                  ]
                },
                    {
                      "title":"Premium Wash Packages",
                      "subtitle":"Carsize:\nSmall=10000Ks\nMedium=12000Ks\nLarge=15000Ks",
                      "image_url":"https://i.pinimg.com/564x/3e/ed/d9/3eedd967b902ffbf9c4b3b5fba59413c.jpg",
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Book Premium package",
                          "payload":userInput+"/prm"
                        },
                  ]
                }
              ]
            }
          }
        }
      }
        requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
      genericMessage
      ).then(response=>{
        console.log(response)
      }).fail(error=> {
        console.log(error)
      })
      }
    
      //end of  packages
    
      
  //start basic 
  
  if(userInput.includes("basic")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "The following services are included in this package: \nBody Cleaning, Window Cleaning ✔️\nTire and Ally Cleaning✔️\nDashboard Cleaning✔️\nWindows Cleaning✔️\nVacuuming Interior✔️"
        }
      };
      var udetails = JSON.parse(success.body);
      var senderID = webhook_event.sender.id;
      let genericMessage = {
        "recipient":{
          "id": webhook_event.sender.id
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                {
                "title":"Book basic Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/b_both/"+userInput+"/"+udetails.name+"/"+senderID,
                    "title":"Yes",
                    "webview_height_ratio": "full",
                  },
                  {
                    "type":"postback",
                    "title":"No",
                    "payload":"n_b"
                  },
                  
                ]
  
              },
            ],
            
            }
          }
  
        }
      }
      
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  textMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  genericMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
}).catch(error=>{
console.log(error)
})
    
}

  //end basic 

  //start standard 
  if(userInput.includes("st")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "The following services are inclued in this package:\nDashboard Cleaning✔️\nWindows Cleaning✔️\nVacuuming Interior✔️\nFloor mats cleaning✔️\nSeat Cleaning✔️\nStain Removing✔️\nInstalling Air-fresher✔️\nTrunk cleaning✔️\nDetail Cleaning✔️\nStain Removal✔️\nWindows Cleaning✔️\nTire and Alloy Cleaning✔️\nAlloy Polishing✔️\nWaxing or polishing✔️\n"
        }
      };
      var udetails = JSON.parse(success.body);
      var senderID = webhook_event.sender.id;
      let genericMessage = {
        "recipient":{
          "id": webhook_event.sender.id
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                {
                "title":"Do you want to choose Standard Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/s_both/"+userInput+"/"+udetails.name+"/"+senderID,
                    "title":"Yes",
                    "webview_height_ratio": "full",
                  },
                  {
                    "type":"postback",
                    "title":"No",
                    "payload":"n_b_ext"
                  },
                  
                ]
  
              },
            ],
            
            }
          }
  
        }
      }
      
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  textMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  genericMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
}).catch(error=>{
console.log(error)
})
    
}
  //end standard
  //start premium both
  if(userInput.includes("prm")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "The follwing services are included in this package:\n Dashboard Cleaning✔️\nWindows Cleaning✔️\nVacuuming Interior✔️\nFloor mats cleaning✔️\nSeat Cleaning✔️\nStain Removing✔️\nInstalling Air-fresher✔️\nTrunk cleaning✔️\nPremium Dressing✔️\nInterior Sterilization✔️\n Detail body cleaning✔️\nStain Removal✔️\nWindows Cleaning and polishing✔️\nTire and Alloy Cleaning✔️\n Tire protection Dressing✔️\n Alloy Detailing✔️\n Waxing✔️\nPolishing"
        }
      };
      var udetails = JSON.parse(success.body);
      var senderID = webhook_event.sender.id;
      let genericMessage = {
        "recipient":{
          "id": webhook_event.sender.id
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                {
                "title":"Do you want to choose Premium Both Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/prm_both/"+userInput+"/"+udetails.name+"/"+senderID,
                    "title":"Yes",
                    "webview_height_ratio": "full",
                  },
                  {
                    "type":"postback",
                    "title":"No",
                    "payload":"n_b_ext"
                  },
                  
                ]
  
              },
            ],
            
            }
          }
  
        }
      }
      
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  textMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
  genericMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
}).catch(error=>{
console.log(error)
})
    
}
  //end premium both      
//start price
if (userInput == 'price'){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Prices for each package is vary according to the size of the car.\nYou can find the prices for each car below"
    }
  };
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
            "title":"Small",
            "subtitle":"Prices for small-sized car such as hetchbacks, popular(Honda Fit, Suzuki Swift)",
            "image_url":"https://i.pinimg.com/originals/79/45/76/794576dd184a34f479d8e503b0edc4af.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"View Prices",
                "payload":"v_s_price"
              },
            ]
          },
          {
            "title":"Medium",
            "subtitle":"Prices for medium-sized car such as sedan, station wagons\nPopular(Toyota Bela, Mark 2,Crown, Suzuki Ciaz)",
            "image_url":"https://www.pinterest.com/pin/772719248552614734",
            "buttons":[
              {
                "type":"postback",
                "title":"View Prices",
                "payload":"v_m_price"
              },
            ]
          },
          {
            "title":"Large",
            "subtitle":"Prices for large-sized car such as suv,mini vans, Light Truck\n Popular(Toyota Harrier, Landcruser,Alphard)",
            "image_url":"https://i.pinimg.com/originals/74/27/c3/7427c35ae87f01fd89bf50f1b2a2c4f4.jpg",
            "buttons":[
              {
                "type":"postback",
                "title":"View Prices",
                "payload":"v_l_price"
              },
            ]
          },

        ],
        
        }
      }

    }
  }
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})

}
//end price
//start s_v_price
if (userInput == 'v_s_price'){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Interior\nBasic-3000ks\nShining-6000ks\nPremium-9000ks\n\nExterior\n\nBasic-3000ks\nShining-6000ks\nPremium-9000ks\n\nBoth\n\nBaisc-5000ks\nShining-11000ks\nPremium-16000ks"
    }
  };
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}
//end s_v_price
//start m_v_price
if (userInput == 'v_m_price'){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Interior\n\nBasic-4000ks\nShining-8000ks\nPremium-12000ks\n\nExterior\n\nBasic-4000ks\nShining-8000ks\nPremium-12000ks\n\nBoth\n\nBaisc-7500ks, Shining-14000ks, Premium-20000ks"
    }
  };
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}
//end m_v_price
//start v_l_price
if (userInput == 'v_l_price'){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Interior\n\nBasic-5000ks\nShining-9000ks\nPremium-15000ks\n\nExterior\n\nBasic-5000ks\nShining-9000ks\nPremium-15000ks\n\nBoth\n\nBaisc-9000ks\nShining-16000ks\nPremium-25000ks"
    }
  };
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}
//end v_l_price
//start otpkg
if (userInput=="cds"){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
  var udetails = JSON.parse(success.body);
  var senderID = webhook_event.sender.id;
  let genericMessage={
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Ceramic Coating",
              "image_url":"https://www.chemicalguys.com/dw/image/v2/BCPT_PRD/on/demandware.static/-/Library-Sites-chemicalguys-shared-content/default/dw897da551/blog/WAC230FAQBLOGFULL.jpg?sw=1116",
              "subtitle":"Product:Hydrocharge Ceramic Sparay Coating/\nEstimated Time:2 Hours",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/cc_book/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book Ceramic Coating"
                },{
                  "type":"postback",
                  "title":"About Ceramic Coating?",
                  "payload":"cc_about"
                }              
              ]      
            },
            {
              "title":"Waxing",
              "image_url":"https://blog.carjunction.com/wp-content/uploads/2018/03/car-wax-990x557.jpg",
              "subtitle":"Automotive Spray Shampoo+ Waxing/\nEstimated Time:2 Hours ",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/wax_book/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book Waxing"
                },{
                  "type":"postback",
                  "title":"About Waxing?",
                  "payload":"wax_about"
                }              
              ]      
            },
            {
              "title":"Sealant Painting",
              "image_url":"https://images-na.ssl-images-amazon.com/images/I/51VfqfklClL.jpg",
              "subtitle":"Automotive Spray Shampoo+ Waxing/\nEstimated Time:2 Hours",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/sealant_book/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book Sealant Painting"
                },{
                  "type":"postback",
                  "title":"About Sealant Painting?",
                  "payload":"sealant_about"
                }              
              ]      
            },
            {
              "title":"Rim Detailing",
              "image_url":"https://cdn.shopify.com/s/files/1/2805/4116/products/natural-boar-hair-car-auto-cleaning-detailing-brushes-set-for-wheel-air-vent-trim-nicerin-best-goods-free-shipping_778_1024x1024.jpg?v=1579070968",
              "subtitle":"Estimated Time:1 hour 30 minutes · 15,000 Ks per Rim",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/rim_book/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book for Rim Detailing"
                },{
                  "type":"postback",
                  "title":"About Rim Detailing",
                  "payload":"rim_about"
                }              
              ]      
            },
            {
              "title":"Engine Bay cleaning",
              "image_url":"https://lh3.googleusercontent.com/proxy/AJAEbBxDgcdY5LPDltNhiVaWwp2zZ_N66_wg0KXtDIywZArrsmH7cHV2qSGjVJCvZYyL-xyTL9LyXlwEHIOEvhp8YKpR5aZLg51XSe7TJJtYtabJwaGf3GMJS_Cj7jY99XFmnvSdcmOpWrxZyfGe3s1b",
              "subtitle":"Estimated Time:1 hour",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/egbay_book/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book for Engine Bay Cleaning"
                },{
                  "type":"postback",
                  "title":"About Engine Bay Cleaning?",
                  "payload":"egbay_about"
                }              
              ]      
            },
            {
              "title":"Headlight Restoration",
              "image_url":"https://www.daohingtrading.com/wp-content/uploads/2017/12/before-after-headlight-e14211114447681.jpg",
              "subtitle":"1 hour and up · 30,000 Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/prm_both/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book for Headlight Restoration"
                },{
                  "type":"postback",
                  "title":"About Headlight Restoration?",
                  "payload":"headres_about"
                }              
              ]      
            }

          ]
        }
      }
    }
  }
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
}).fail(error=> {
  console.log(error)
})
}).catch(error=>{
console.log(error)
})
}

    
//end otpkg
if (userInput== "con"){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "You can contact us to: \nEmail-adsltheprescence@gmail.com\nPhone:+95765333508"
    }
  };
  let genericMessage = {
    "recipient":{
      "id": webhook_event.sender.id
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
            "text":"Need further assistance? Talk to representative",
            "buttons":[
              {
                "type":"phone_number",
                "title":"Call Customer Service",
                "payload":"+95765333508"
              }
            ]
      }
    }
  }
}
requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
textMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
  requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
genericMessage
).then(response=>{
  console.log(response)
}).fail(error=> {
  console.log(error)
})
}


      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
      
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
  /***********************************
FUNCTION TO ADD WHITELIST DOMAIN
************************************/

const whitelistDomains = (res) => {
  var messageData = {
          "whitelisted_domains": [
             "https://mmcarwash.herokuapp.com" , 
             "https://herokuapp.com"                           
          ]               
  };  
  request({
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ pageaccesstoken,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: messageData
  },
  function (error, response, body) {
      if (!error && response.statusCode == 200) {          
          res.send(body);
      } else {           
          res.send(body);
      }
  });
}