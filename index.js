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

  
  const db = firebase.firestore();





  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.get('/whitelists',function(req,res){    
  whitelistDomains(res);
});

app.get('/index/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('index.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/b_ext/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('b_ext.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/b_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('b_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/s_int/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('s_int.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/s_ext/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('s_ext.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
});
app.post('/s_ext',function(req,res){
       
  let name  = req.body.name;
  let phone = req.body.phone;
  let town = req.body.town;
  let address = req.body.address_info
  let carsize=req.body.carsize
  let price= req.body.price
  let sender = req.body.sender;    
  let date= req.body.date;
  let time= req.body.time;



  /*
  bucket.upload(img_url).then(data => {
  console.log('upload success');
  }).catch(err => {
      console.log('error uploading to storage', err);
  });
  */  
  
  db.collection('standard_exterior_booking').add({
        name: name,
        phone: email,
        town: town,
        address:address,
        carsize: carsize,
        price: price,
        sender: sender,
        date: date,
        time:time
      }).then(success => {   
         console.log("DATA SAVED")
         thankyouReply(sender, name);    
      }).catch(error => {
        console.log(error);
  });        
});

app.get('/s_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('s_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/prm_int/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('prm_int.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})
app.get('/carwash/:washtype/:place/:name/:id', (req, res) => {

  var name = req.params.name;
  var washType=req.params.washtype;
  var place=req.params.place;
  var senderID=req.params.id;
  res.render('carwash.ejs', {name:name, washtype:washType,place:place, id:senderID})
  
})
app.get('/prm_ext/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('prm_ext.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
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
                        "payload":"book"
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

     //start booking
      if(userInput=="book"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "Lets get this dirty car washed!"
          }
        };
        let genericMessage ={
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
                    "title":"Lets start booking by choosing one from below",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Book Now",
                      "payload":"now"
                      },
                      {
                      "type":"postback",
                      "title":"View Plans and Packages",
                      "payload":"cwpkg"
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
      //start provide water?
      if(userInput=="now"){

        let genericMessage ={
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
                    "title":"Can you provide water for the car wash",
                    "subtitle":"Example: water buckets,pipes,hoes\nDon't worry about equipment",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"y_w"
                      },
                      {
                      "type":"postback",
                      "title":"No",
                      "payload":"n_w"
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
        })
      }
      //end provide water?
      //start choose wash type
      if(userInput=="y_w"){

        let genericMessage ={
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
                    "title":"Regular Wash",
                    "subtitle":"Good for cars at home or good parking space and can provide water\nand heavy dirt and mud scrub down",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Select",
                      "payload":"rw"
                      },
                    ]
                  },
                  {
                    "title":"Waterless Wash",
                    "subtitle":"Good for cars anywhere,home,street,office,shopping center\nand Eco-friendly",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Select",
                      "payload":"ww"
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
      //end choose wash type
     //end booking
       //end car wash
      //start of wash packages
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
                  "title":"Basic Wash Packages",
                  "subtitle":"These are the basic packages",
                  "image_url":"https://i.pinimg.com/originals/ec/43/2c/ec432c1852f268a95aee064997964275.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Interior",
                      "payload":userInput+"/b_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":userInput+"/b_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":userInput+"/b_both"
                    },
                  ]
  
                },
                {
                  "title":"Shining Wash Packages",
                  "subtitle":"These are the Shining Packages",
                  "image_url":"https://i.pinimg.com/originals/24/8c/6f/248c6f595b1181e4fafb09cd51ed90e7.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Interior",
                      "payload":userInput+"/s_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":userInput+"/s_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":userInput+"/s_both"
                    },
                  ]
                },
                    {
                      "title":"Premium Wash Packages",
                      "subtitle":"These are the Premium Packages",
                      "image_url":"https://i.pinimg.com/originals/d2/2b/31/d22b3117b17e5917dfca78130caa8272.jpg",
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Interior",
                          "payload":userInput+"/prm_int"
                        },
                        {
                          "type":"postback",
                          "title":"Exterior",
                          "payload":userInput+"/prm_ext"
                        },
                        {
                          "type":"postback",
                          "title":"Both",
                          "payload":userInput+"/prm_both"
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
    
      //end of wash packages
      //start basic interior
      
      if(userInput.includes("b_int")){
        console.log(userInput);
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
          let textMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text": "In the Package: \nDashboard Cleaning, Windows Cleaning, Vacuuming Interior"
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
                    "title":"Do you want to choose Basic Interior Package?:",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/index/"+userInput+"/"+udetails.name+"/"+senderID,
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
  //end basic int
  //start basic ext
  
  if(userInput.includes("b_ext")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package: \nBody Cleaning, Window Cleaning, Tire and Ally Cleaning"
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
                "title":"Do you want to choose Basic Exterior Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/b_ext/"+userInput+"/"+udetails.name+"/"+senderID,
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
  //end basic ext
  //start basic both
  
  if(userInput.includes("b_both")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package: \nBody Cleaning, Window Cleaning, Tire and Ally Cleaning, Dashboard Cleaning, Windows Cleaning, Vacuuming Interior"
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
                "title":"Do you want to choose Basic Both Package?:",
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

  //end basic both
      //start shining interior
      if(userInput.includes("s_int")){
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
          let textMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text": "In the Package:\n Dashboard Cleaning, Windows Cleaning, Vacuuming Interior, Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning"
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
                    "title":"Do you want to choose Standard Interior Package?:",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/s_int/"+userInput+"/"+udetails.name+"/"+senderID,
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
  //end shining int
  //start shining ext
  if(userInput.includes("s_ext")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package:\n Detail Cleaning, Stain Removal, Windows Cleaning, Tire and Alloy Cleaning, Alloy Polishing, Waxing or polishing"
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
                "title":"Do you want to choose Standard Exterior Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/s_ext/"+userInput+"/"+udetails.name+"/"+senderID,
                    "title":"Yes",
                    "messenger_extensions":true,
                    "webview_height_ratio": "full",
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
  //end shining ext
  //start shinging both
  if(userInput.includes("s_both")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package:\nDashboard Cleaning\nWindows Cleaning\nVacuuming Interior\nFloor mats cleaning\nSeat Cleaning\nStain Removing\nInstalling Air-fresher\nTrunk cleaning\nDetail Cleaning\nStain Removal\nWindows Cleaning\nTire and Alloy Cleaning\nAlloy Polishing\nWaxing or polishing"
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
                "title":"Do you want to choose Standard Both Package?:",
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
  //end shining both
      //start premium interior
      if(userInput.includes("prm_int")){
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
          let textMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text": "In the Package:\nDashboard Cleaning\nWindows Cleaning\nVacuuming Interior\nFloor mats cleaning\nSeat Cleaning\nStain Removing\nInstalling Air-fresher\nTrunk cleaning\nPremium Dressing\nInterior Sterilization"
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
                    "title":"Do you want to choose Premium Interior Package?:",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/prm_int/"+userInput+"/"+udetails.name+"/"+senderID,
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
  //end premium int
  //start premium ext
  if(userInput.includes("prm_ext")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package:\n Detail body cleaning, Stain Removal, Windows Cleaning and polishing, Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing, Waxing, Polishing"
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
                "title":"Do you want to choose Premium Exterior Package?:",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://mmcarwash.herokuapp.com/prm_ext/"+userInput+"/"+udetails.name+"/"+senderID,
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
  //end premuim ext
  //start premium both
  if(userInput.includes("prm_both")){
    requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
      let textMessage = {
        "recipient":{
          "id":webhook_event.sender.id
        },
        "message":{
          "text": "In the Package:\n Dashboard Cleaning, Windows Cleaning, Vacuuming Interior,Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning,Premium Dressing, Interior Sterilization Detail body cleaning, Stain Removal, Windows Cleaning and polishing,Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing, Waxing,Polishing"
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