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

app.get('/carwash/:washtype/:intorext/:name/:id', (req, res) => {

  var name = req.params.name;
  var washType=req.params.washtype;
  var intorext=req.params.intorext;
  var senderID=req.params.id;
  res.render('carwash.ejs', {name:name, washtype:washType,intorext:intorext, id:senderID})
  
})
const thankyouReply = (sender_psid, ref) => { 
  let response = {
  "text": `Your data is saved`,    
  };
  callSend(sender_psid, response); 
}
app.post('/carwash',function(req,res){
       
  let name  = req.body.name;
  let washtype = req.body.washtype;
  let intorext = req.body.intorext;
  let phone = req.body.phone;
  let city = req.body.city;
  let town = req.body.town;
  let address = req.body.address;
  let carinfo = req.body.carinfo;
  let carsize = req.body.carsize;
  let price = req.body.price;
  let date = req.body.date;
  let time = req.body.time;
  let sender = req.body.sender;    

  db.collection('Car Wash Booking').add({
        name: name,
        washtype:washtype,
        intorext:intorext,
        phone:phone,
        city:city,
        town:town,
        address:address,
        carinfo:carinfo,
        carsize:carsize,
        price:price,
        date:date,
        time:time,
        sender:sender
      }).then(success => {   
         console.log("DATA SAVED")
         thankyouReply(sender, name);    
      }).catch(error => {
        console.log(error);
  });        
});

app.get('/prm_both/:package/:wtype/:name/:id', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  var senderID=req.params.id;
  res.render('prm_both.ejs', {name:name, package:washpackage, wtype:wtype,id:senderID})
  
})

app.get('/whitelists',function(req,res){    
  whitelistDomains(res);
});
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
                    "subtitle":"Good for cars that have good parking space and want heavy mud and dirt scrub down",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Select",
                      "payload":"regular"
                      },
                    ]
                  },
                  {
                    "title":"Waterless Wash",
                    "subtitle":"Good for cars anywhere,home,street,office,shopping center and Eco-friendly",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Select",
                      "payload":"warterless"
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
      //start choose int or ext
      if(userInput=="regular" || userInput=="warterless"){
      
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
                    "title":"Which one do you want clean and wash",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Interior",
                      "payload":userInput+"/int"
                      },
                      {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":userInput+"/ext"
                      },
                      {
                      "type":"postback",
                      "title":"Both",
                      "payload":userInput+"/both"
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
      //end choose int or ext
      //start booking form
      if(userInput.includes("/int")){
        console.log(userInput);
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

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
                    "title":"Fill the form to book the car wash",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/carwash/"+userInput+"/"+udetails.name+"/"+senderID,
                        "title":"Fill the Form",
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
      genericMessage
      ).then(response=>{
        console.log(response)
      }).fail(error=> {
        console.log(error)
      })
  })
        
      }
      if(userInput.includes("/ext")){
        console.log(userInput);
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

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
                    "title":"Fill the form to book the car wash",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/carwash/"+userInput+"/"+udetails.name+"/"+senderID,
                        "title":"Fill the Form",
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
      genericMessage
      ).then(response=>{
        console.log(response)
      }).fail(error=> {
        console.log(error)
      })
  })
        
      }
      if(userInput.includes("/both")){
        console.log(userInput);
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

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
                    "title":"Fill the form to book the car wash",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://mmcarwash.herokuapp.com/carwash/"+userInput+"/"+udetails.name+"/"+senderID,
                        "title":"Fill the Form",
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
      genericMessage
      ).then(response=>{
        console.log(response)
      }).fail(error=> {
        console.log(error)
      })
  })
        
      }
      //end booking form
      if(userInput=="n_w"){

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
                    "title":"Waterless Wash",
                    "subtitle":"Good for cars anywhere,home,street,office,shopping center and Eco-friendly",
                    "buttons":[
                      {
                      "type":"postback",
                      "title":"Select",
                      "payload":"waterless"
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
     //end booking
       //end car wash
//start plans
if(userInput=="plans"){
  
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
              "title":"These are plans we offer",
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
  genericMessage
  ).then(response=>{
    console.log(response)
  }).fail(error=> {
    console.log(error)
  })
}
      //start basic interior
      
      
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
           "https://mmcarwash.herokuapp.com/" , 
           "https://herokuapp.com/" ,
           "https://mmcarwash.herokuapp.com/carwash/"                  
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