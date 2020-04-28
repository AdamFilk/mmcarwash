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


app.get('/plans/:plan/:name/:id/:month', (req, res) => {

  var name = req.params.name;
  var month=req.params.month;
  var plan=req.params.plan;
  var senderID=req.params.id;
  res.render('plans.ejs', {name:name, month:month,plan:plan, id:senderID})
  
})
app.get('/plan_once/:plan/:name/:id', (req, res) => {

  var name = req.params.name;
  var plan=req.params.plan;
  var senderID=req.params.id;
  res.render('plan_once.ejs', {name:name,plan:plan, id:senderID})
  
})
app.get('/carwash/:washtype/:intorext/:name/:id', (req, res) => {

  var name = req.params.name;
  var washType=req.params.washtype;
  var intorext=req.params.intorext;
  var senderID=req.params.id;
  res.render('carwash.ejs', {name:name, washtype:washType,intorext:intorext, id:senderID})
  
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
                      "payload":"plans"
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
      //end choose wash type
      //start choose int or ext
      if(userInput=="regular" || userInput=="waterless"){

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
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "If you subscribe to our plan, we will provide you with unlimited car wash for subscribed number of month/s"
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
              "title":"Bronze plan",
              "subtitle":"Available plans",
              "image_url":"https://i.pinimg.com/564x/4e/7a/79/4e7a79bc31c39cdc0ea944a6a618ac9b.jpg",
              "buttons":[
                {
                "type":"postback",
                "title":"Select",
                "payload":"bronze"
                }
              ]
            },
            {
              "title":"Silver plan",
              "image_url":"https://i.pinimg.com/564x/2b/a4/c0/2ba4c00cb92f1b6b9e77ab9c84b77a1d.jpg",
              "subtitle":"Available plans",
              "buttons":[
                {
                "type":"postback",
                "title":"Select",
                "payload":"silver"
                }
              ]
            },
            {
              "title":"Gold plan",
              "image_url":"https://i.pinimg.com/564x/c9/25/62/c9256251709a5bbdf864f8243cdbec3d.jpg",
              "subtitle":"Available plans",
              "buttons":[
                {
                "type":"postback",
                "title":"Gold",
                "payload":"gold"
                }
              ]
            },
            {
              "title":"Platinum Plan",
              "subtitle":"Available plans",
              "image_url":"https://i.pinimg.com/564x/ec/2f/83/ec2f8388521c3f956a1379736c3fd08c.jpg",
              "buttons":[
                {
                "type":"postback",
                "title":"Select",
                "payload":"platinum"
                }
              ]
            },
            {
              "title":"Diamond Plans",
              "image_url":"https://i.pinimg.com/564x/4a/37/83/4a378324e74f0196c76101ad37b90875.jpg",
              "subtitle":"Available plans",
              "buttons":[
                {
                "type":"postback",
                "title":"Select",
                "payload":"diamond"
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
if(userInput=="bronze" ){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

    var udetails = JSON.parse(success.body);
    var senderID = webhook_event.sender.id;
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "What's in the plan:\nExterior body wash✔️\nRims & Tire Shine✔️"
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
              "title":"Select how many months do you want to subscribe for this plan",
              "subtitle":"subcribe to get weekly car wash",
              "image_url":"https://i.pinimg.com/564x/4e/7a/79/4e7a79bc31c39cdc0ea944a6a618ac9b.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/1`,
                  "title":"1 month",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/2`,
                  "title":"2 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/3`,
                  "title":"3 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                }
              ]
            },
            {
              "title":"Book plan for just this once",
              "subtitle":"Book to get these services for once",
              "image_url":"https://i.pinimg.com/564x/4e/7a/79/4e7a79bc31c39cdc0ea944a6a618ac9b.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/plan_once/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
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
})
}
if(userInput=="silver" ){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

    var udetails = JSON.parse(success.body);
    var senderID = webhook_event.sender.id;
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "What's in the plan:\nExterior body wash✔️Rims & Tire Shine✔️Interior Vacuum✔️Wipe all Surfaces✔️Interior Windows✔️"
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
              "title":"Select how many months do you want to subscribe for this plan",
              "subtitle":"subcribe to get weekly car wash",
              "image_url":"https://i.pinimg.com/564x/2b/a4/c0/2ba4c00cb92f1b6b9e77ab9c84b77a1d.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/1`,
                  "title":"1 month",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/2`,
                  "title":"2 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/3`,
                  "title":"3 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                }
              ]
            },
            {
              "title":"Book plan for just this once",
              "subtitle":"Book to get these services for once",
              "image_url":"https://i.pinimg.com/564x/2b/a4/c0/2ba4c00cb92f1b6b9e77ab9c84b77a1d.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/plan_once/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
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
})
}
if(userInput=="gold" ){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

    var udetails = JSON.parse(success.body);
    var senderID = webhook_event.sender.id;
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️"
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
              "title":"Select how many months do you want to subscribe for this plan",
              "subtitle":"subcribe to get weekly car wash",
              "image_url":"https://i.pinimg.com/564x/c9/25/62/c9256251709a5bbdf864f8243cdbec3d.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/1`,
                  "title":"1 month",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/2`,
                  "title":"2 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/3`,
                  "title":"3 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                }
              ]
            },
            {
              "title":"Book plan for just this once",
              "subtitle":"Book to get these services for once",
              "image_url":"https://i.pinimg.com/564x/c9/25/62/c9256251709a5bbdf864f8243cdbec3d.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/plan_once/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
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
})
}
if(userInput=="platinum" ){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

    var udetails = JSON.parse(success.body);
    var senderID = webhook_event.sender.id;
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️\nClay bar polish✔️\nHard Coat Hand Wax✔️"
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
              "title":"Select how many months do you want to subscribe for this plan",
              "subtitle":"subcribe to get weekly car wash",
              "image_url":"https://i.pinimg.com/564x/ec/2f/83/ec2f8388521c3f956a1379736c3fd08c.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/1`,
                  "title":"1 month",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/2`,
                  "title":"2 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/3`,
                  "title":"3 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                }
              ]
            },
            {
              "title":"Book plan for just this once",
              "subtitle":"Book to get these services for once",
              "image_url":"https://i.pinimg.com/564x/ec/2f/83/ec2f8388521c3f956a1379736c3fd08c.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/plan_once/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
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
})
}
if(userInput=="diamond" ){
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

    var udetails = JSON.parse(success.body);
    var senderID = webhook_event.sender.id;
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️\nClay bar polish✔️\nHard Coat Hand Wax✔️\nPaint Polish and Hybrid Ceramic Sealant✔️\nExterior Plastic Dressing w/ UV Protection✔️"
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
              "title":"Select how many months do you want to subscribe for this plan",
              "subtitle":"subcribe to get weekly car wash",
              "image_url":"https://i.pinimg.com/564x/4a/37/83/4a378324e74f0196c76101ad37b90875.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/1`,
                  "title":"1 month",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/2`,
                  "title":"2 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
                {
                  "type":"web_url",
                  "url":`https://mmcarwash.herokuapp.com/plans/${userInput}/${udetails.name}/${senderID}/3`,
                  "title":"3 months",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                }
              ]
            },
            {
              "title":"Book plan for just this once",
              "subtitle":"Book to get these services for once",
              "image_url":"https://i.pinimg.com/564x/4a/37/83/4a378324e74f0196c76101ad37b90875.jpg",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/plan_once/"+userInput+"/"+udetails.name+"/"+senderID,
                  "title":"Book",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
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
})
}

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
           "https://mmcarwash.herokuapp.com/carwash/" ,
           "https://mmcarwash.herokuapp.com/plans/"                  
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