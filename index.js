'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

  const pageaccesstoken = 'EAAKGyWXj6KABAEWctoGADzQgZBCK mpqfhcxPYqvasGphAK6CYjuvc42ZCnHZBCjC6tqKGZAotsjKadLyRK0iX6qxI8kBDwPyTInwV17umvWBZC1mUa5m0ofKpZA8h2rrUA1qql9BI8F10N9BmaBDeqVW0U5yZB8vVizzwTaHsf7qMFsOqlSWuXdI8l7CRbJkh8ZD'

  requestify.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${pageaccesstoken}`, 
  {
    "get_started": {
      "payload": "Hi"
    },
    "greeting": [
      {
        "locale":"default",
        "text":"Hello {{user_first_name}}!" 
      }, {
        "locale":"en_US",
        "text":"Timeless apparel for the masses."
      }
    ]
  }
).then( response => {
  console.log(response)
}).fail( error => {
  console.log(error)
})

  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

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
        console.log(webhook_event);
        if(webhook_event.message){
          var userInput = webhook_event.message.text
        }
        if(webhook_event.postback){
          var userButton = webhook_event.postback.payload
        }
        if (userInput == 'Hi' || userButton == 'Hi' ){
          let welcomeMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text":"Hi! Welcome from MM Car Wash. Tired of cleaning your car by yourself and don't want to go to the car wash service? Here we send our cleaners on bicycles to clean your car shine. You just need to book an appointment and they'll be on the way 😄😄😄"
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
                      //star book
                  
                    "title":"🚲 🚲 🚲",
                    "subtitle":"",
                    "image_url":"https://focus2move.com/wp-content/uploads/2019/10/Tesla-Model3_2019.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Book Car Wash",
                        "payload":"bcw"
                      }
                    ]
  
                  }
                ]
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
        }
        //end of book 

        //start of choose one
        if (userButton == 'bcw'){

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
                      //star book
                  
                    "title":"please choose the size of your car!",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Small",
                        "payload":"s"
                      },
                      {
                        "type":"postback",
                        "title":"Medium",
                        "payload":"m"
                      },
                      {
                        "type":"postback",
                        "title":"Large",
                        "payload":"l"
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
          //end of choose one
        }

        //star of small
        if (userButton == 's'){

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
                    "title":"Price for the small car is 3000ks haven't included transport fees.",
                    "subtitle":"Please choose which part of your car you want to clean?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"interior",
                        "payload":"int1"
                      },
                      {
                        "type":"postback",
                        "title":"exterior",
                        "payload":"ext1"
                      },
                      {
                        "type":"postback",
                        "title":"both",
                        "payload":"bo1"
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
        //end of samll 
          
       //start of medium
       if (userButton == 'm'){

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
                  "title":"Price for the small car is 3000ks haven't included transport fees.",
                  "subtitle":"Please choose which part of your car you want to clean?",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"interior",
                      "payload":"int2"
                    },
                    {
                      "type":"postback",
                      "title":"exterior",
                      "payload":"ext2"
                    },
                    {
                      "type":"postback",
                      "title":"both",
                      "payload":"bo2"
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
       //end of medium 
      
       //stat of large
       if (userButton == 'l'){

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
                  "title":"Price for the small car is 3000ks haven't included transport fees.",  
                  "subtitle":"Please choose which part of your car you want to clean?",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"interior",
                      "payload":"int3"
                    },
                    {
                      "type":"postback",
                      "title":"exterior",
                      "payload":"ext3"
                    },
                    {
                      "type":"postback",
                      "title":"both",
                      "payload":"bo3"
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
       //end of large 
       //start of wreq1
       if (userButton == 'int1'){

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
                  "title":"Will you be able to provide water",  
                  "subtitle":"As in water buckets,hoes or pipes",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"y1"
                    },
                    {
                      "type":"postback",
                      "title":"No",
                      "payload":"n1"
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
      //start of the ChooseCarwashMethod
      if (userButton == 'y1'){

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
                  "title":"Choose which type of washing method you prefer.",  
                  "subtitle":"Don't worry!! We'll tell you about them!",
                  "image_url":"https://thewashingtonnote.com/wp-content/uploads/2017/02/Car-Wash-Soap-scaled-1-696x464.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Waterless Wash",
                      "payload":"wtl1"
                    },
                    {
                      "type":"postback",
                      "title":"Handwash",
                      "payload":"hw1"
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
      //end of the ChooseCarwashMethod
      //start of the waterless
      if (userButton == 'wtl1'){
        let welcomeMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text":"Waterless washing method do not use water but it uses an organic and chemical liquids in a spray bottle to clean your glasses and wax your car. It can remove most stains and bird poops. But it can't handle heavy mud or dirt stains which require intense scrubbing"
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
                  "title":"Do you want to use waterless washing method?",  
                  "subtitle":"Click 'yes' to continue booking",
                  "image_url":"https://image.shutterstock.com/image-vector/waterless-car-wash-260nw-1353847511.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"yes1"
                    },
                    {
                      "type":"postback",
                      "title":"No",
                      "payload":"no1"
                    },

                  ]

                }
              ]
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
      } 

      //end of the waterless
      //start of handwash
      if (userButton == 'hw1'){
        let welcomeMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text":"Handwash is a very traditional and common way to cleaning and washing your car. It only requires car washing soaps and uses the water which you will need to provide. It is effective for intense scrub downs of mud and dirt stains"
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
                  "title":"Do you want to use handwash method?",  
                  "subtitle":"Click 'yes' to continue booking",
                  "image_url":"https://images.theconversation.com/files/76578/original/image-20150331-1231-1ttwii6.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"yes1"
                    },
                    {
                      "type":"postback",
                      "title":"No",
                      "payload":"no1"
                    },

                  ]

                }
              ]
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
      } 
      //end of handwash














      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });