'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()), // creates express http server
  ejs = require("ejs");

  const pageaccesstoken = 'EAAKGyWXj6KABAEWctoGADzQgZBCK mpqfhcxPYqvasGphAK6CYjuvc42ZCnHZBCjC6tqKGZAotsjKadLyRK0iX6qxI8kBDwPyTInwV17umvWBZC1mUa5m0ofKpZA8h2rrUA1qql9BI8F10N9BmaBDeqVW0U5yZB8vVizzwTaHsf7qMFsOqlSWuXdI8l7CRbJkh8ZD'


  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.get('/index/:package/:wtype/:name', (req, res) => {
  var name = req.params.name;
  var washpackage=req.params.package;
  var wtype=req.params.wtype;
  res.render('index.ejs', {name:name, package:washpackage, wtype:wtype})
  
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
          var userInput = webhook_event.postback.payload
        }
        if (userInput == 'Hi'){
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
        }
        //end of select
       //start of book
       if (userInput == 'book'){

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
                      "payload":userInput+"/basic_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":userInput+"/basic_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":userInput+"/basic_both"
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
                      "payload":userInput+"/shine_int"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":userInput+"/shine_ext"
                    },
                    {
                      "type":"postback",
                      "title":"Both",
                      "payload":userInput+"/shine_both"
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
                          "payload":userInput+"/sprm_both"
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
      if(userInput.includes("basic_int")){
        requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{
          let textMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text": "In the Package: \nDashboard Cleaning, Windows Cleaning, Vacuuming Interior"
            }
          };
          var udetails = JSON.parse(success.body)
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
                        "url":"https://mmcarwash.herokuapp.com/index/"+userInput+"/"+udetails.name,
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
  if(userInput=="basic_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: \nBody Cleaning, Window Cleaning, Tire and Ally Cleaning"
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
  if(userInput=="basic_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package: \nBody Cleaning, Window Cleaning, Tire and Ally Cleaning, Dashboard Cleaning, Windows Cleaning, Vacuuming Interior"
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
      if(userInput=="shine_int"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "In the Package:\n Dashboard Cleaning, Windows Cleaning, Vacuuming Interior, Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning"
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
  if(userInput=="shine_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package:\n Detail Cleaning, Stain Removal, Windows Cleaning, Tire and Alloy Cleaning, Alloy Polishing, Waxing or polishing"
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
  if(userInput=="shine_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package:\nDashboard Cleaning\nWindows Cleaning\nVacuuming Interior\nFloor mats cleaning\nSeat Cleaning\nStain Removing\nInstalling Air-fresher\nTrunk cleaning\nDetail Cleaning\nStain Removal\nWindows Cleaning\nTire and Alloy Cleaning\nAlloy Polishing\nWaxing or polishing"
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
      if(userInput=="prm_int"){
        let textMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "text": "In the Package:\nDashboard Cleaning\nWindows Cleaning\nVacuuming Interior\nFloor mats cleaning\nSeat Cleaning\nStain Removing\nInstalling Air-fresher\nTrunk cleaning\nPremium Dressing\nInterior Sterilization "
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
  if(userInput=="prm_ext"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package:\n Detail body cleaning, Stain Removal, Windows Cleaning and polishing, Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing, Waxing, Polishing"
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
  if(userInput=="prm_both"){
    let textMessage = {
      "recipient":{
        "id":webhook_event.sender.id
      },
      "message":{
        "text": "In the Package:\n Dashboard Cleaning, Windows Cleaning, Vacuuming Interior,Floor mats cleaning, Seat Cleaning, Stain Removing, Installing Air-fresher, Trunk cleaning,Premium Dressing, Interior Sterilization Detail body cleaning, Stain Removal, Windows Cleaning and polishing,Tire and Alloy Cleaning, Tire protection Dressing, Alloy Detailing, Waxing,Polishing"
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
            "subtitle":"Prices for large-sized car such as suv,mini vans, Light Truck\n Popular(Toyota Harrier, Landcruser...)",
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
      "text": "Interior\n\nBasic-3000ks\nShining-6000ks\nPremium-9000ks\n\nExterior\n\nBasic-3000ks\nShining-6000ks\nPremium-9000ks\n\nBoth\n\nBaisc-5000ks\nShining-11000ks\nPremium-16000ks"
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