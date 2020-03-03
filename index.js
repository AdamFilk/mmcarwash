'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

  const pageaccesstoken = 'EAAKGyWXj6KABAEWctoGADzQgZBCK mpqfhcxPYqvasGphAK6CYjuvc42ZCnHZBCjC6tqKGZAotsjKadLyRK0iX6qxI8kBDwPyTInwV17umvWBZC1mUa5m0ofKpZA8h2rrUA1qql9BI8F10N9BmaBDeqVW0U5yZB8vVizzwTaHsf7qMFsOqlSWuXdI8l7CRbJkh8ZD'


  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

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
              "text":"Hi! Welcome from MM Car Wash 😄😄😄"
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
                    "title":"Please Choose One",
                    "subtitle":"as",
                    "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"View Services",
                        "payload":"book"
                      },
                      {
                        "type":"postback",
                        "title":"Prices",
                        "payload":"price"
                      },
                      {
                        "type":"postback",
                        "title":"View Appointment",
                        "payload":"View Appointment"
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
        }
        //end of select
       //start of book
       if (userButton == 'book'){

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
                  "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Car Wash Packages",
                      "payload":"cwpkg"
                    },
                    {
                      "type":"postback",
                      "title":"Other Services",
                      "payload":"otpkg"
                    },
                    {
                      "type":"postback",
                      "title":"Self Customize Services",
                      "payload":"adhoc"
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
      //start of wash packages
      if (userButton== "cwpkg"){
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
                  "subtitle":"a",
                  "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Interior",
                      "payload":"basic_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":"basic_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":"basic_both"
                    },
                  ]
  
                },
                {
                  "title":"Shining Wash Packages",
                  "subtitle":"a",
                  "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Interior",
                      "payload":"shine_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":"shine_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":"shine_both"
                    },
                  ]
                },
                    {
                      "title":"Premium Wash Packages",
                      "subtitle":"a",
                      "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                      "buttons":[
                        {
                          "type":"postback",
                          "title":"Interior",
                          "payload":"prm_int"
                        },
                        {
                          "type":"postback",
                          "title":"Exterior",
                          "payload":"prm_ext"
                        },
                        {
                          "type":"postback",
                          "title":"Both",
                          "payload":"prm_both"
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
      if(userButton=="basic_int"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "In the Package: Dashboard Cleaning, Windows Cleaning, Vacuuming Interior"
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
                  "title":"Do you want to choose Basic Exterior Package?:",
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"https://mmcarwash.herokuapp.com/index",
                      "title":"Yes",
                      "webview_height_ratio": "tall",
                    },
                    {
                      "type":"web_url",
                      "url":"https://mmcarwash.herokuapp.com/index",
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
  }
  //end basic int
  //start basic ext
  if(userButton=="basic_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Body Cleaning, Window Cleaning, Tire and Ally Cleaning"
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
              "title":"Do you want to choose Basic Exterior Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_b_ext"
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
}
  //end basic ext
  //start basic both
  if(userButton=="basic_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Body Cleaning, Window Cleaning, Tire and Ally Cleaning, \nDashboard Cleaning, Windows Cleaning, Vacuuming Interior"
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
              "title":"Do you want to choose Basic Both Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_b_both"
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":"n_b_both"
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
  //end basic both
      //start shining interior
      if(userButton=="shine_int"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "In the Package: Dashboard Cleaning, Windows Cleaning, Vacuuming Interior, \n Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning"
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
                  "title":"Do you want to choose Shining Interior Package?:",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"y_s_int"
                    },
                    {
                      "type":"postback",
                      "title":"No",
                      "payload":"n_s_int"
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
  //end shining int
  //start shining ext
  if(userButton=="shine_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Detail Cleaning, Stain Removal, Windows Cleaning, \nTire and Alloy Cleaning, Alloy Polishing, \nWaxing or polishing"
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
              "title":"Do you want to choose Shining Exterior Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_s_ext"
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":"n_s_ext"
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
  //end shining ext
  //start shinging both
  if(userButton=="shine_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Dashboard Cleaning, Windows Cleaning, Vacuuming Interior, \n Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning,\n Detail Cleaning, Stain Removal, Windows Cleaning, \nTire and Alloy Cleaning, Alloy Polishing, \nWaxing or polishing"
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
              "title":"Do you want to choose Shining Both Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_s_both"
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":"n_s_both"
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
  //end shining both
      //start premium interior
      if(userButton=="prm_int"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "In the Package: Dashboard Cleaning, Windows Cleaning, Vacuuming Interior,\n Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning,\nPremium Dressing, Interior Sterilization "
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
                  "title":"Do you want to choose Premium Interior Package?:",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Yes",
                      "payload":"y_p_int"
                    },
                    {
                      "type":"postback",
                      "title":"No",
                      "payload":"n_p_int"
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
  //end premium int
  //start premium ext
  if(userButton=="prm_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Detail body cleaning, Stain Removal, Windows Cleaning and polishing,\n Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing, Waxing, \nPolishing"
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
              "title":"Do you want to choose Premium Exterior Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_p_ext"
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":"n_p_ext"
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
  //end premuim ext
  //start premium both
  if(userButton=="prm_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: Dashboard Cleaning, Windows Cleaning, Vacuuming Interior,\n Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning,\nPremium Dressing, Interior Sterilization Detail body cleaning, Stain Removal, Windows Cleaning and polishing,\n Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing,\n Waxing,Polishing"
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
              "title":"Do you want to choose Premium Both Package?:",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Yes",
                  "payload":"y_p_both"
                },
                {
                  "type":"postback",
                  "title":"No",
                  "payload":"n_p_both"
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
  //end premium both      
     
       












      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });