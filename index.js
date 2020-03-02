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
<<<<<<< HEAD
=======
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
                  
                    "title":"🚲MM Carwash🚲",
                    "subtitle":"Choose one",
                    "image_url":"https://i.pinimg.com/236x/84/77/8e/84778ecda6db5a14c94883948af73262.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Start Booking",
                        "payload":"bcw"
                      },
                
                      {
                        "type":"postback",
                        "title":"Check Prices",
                        "payload":"prices"
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
        //start check price
        //price
        if (userButton == 'prices'){

>>>>>>> parent of aac1e00... Update index.js
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
                    "title":"Please Select One:",
                    "subtitle":"Select one to start",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Book",
                        "payload":"book"
                      },
                      {
                        "type":"postback",
                        "title":"Price",
                        "payload":"pricec"
                      },
                      {
                        "type":"postback",
                        "title":"View my appointment",
                        "payload":"view_ap"
                      },
                      {
                        "type":"postback",
                        "title":"About",
                        "payload":"about"
                      },
                      {
                        "type":"postback",
                        "title":"Contact",
                        "payload":"contact"
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
       if (userButton == 'book123'){

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
       //end of book
        

        //start of menu
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
                    "title":"Wash Packages",
                    "subtitle":"Packages for car wash",
                    "image_url":"https://capistranowash.com/wp-content/uploads/2014/09/car-wash-icon.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"View",
                        "payload":"wpkg_view"
                      },
                    ]
  
                  },
                  {
                  "title":"Services",
                  "subtitle":"Browse Services",
                  "image_url":"https://www.logolynx.com/images/logolynx/e2/e21e3a4ae48ffb730a90fa51c63766d5.png",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"View",
                      "payload":"service_view"
                    },
                  ]

                }
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
          //end of choose one
        }
        //end of start booking
        //start of washpkg
        if (userButton == 'wpkg_view'){

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
                    "title":"Hand Wash",
                    "subtitle":"Hand Wash Packages",
                    "image_url":"https://st2.depositphotos.com/1001951/7088/i/450/depositphotos_70888985-stock-photo-man-worker-washing-cars-alloy.jpg",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Basic Hand Wash",
                        "payload":"bhw"
                      },
                      {
                        "type":"postback",
                        "title":"Shining Hand Wash",
                        "payload":"sbhw"
                      },
                    ]
  
                  },
                  {
                  "title":"Waterless Wash",
                  "subtitle":"Waterless Wash Packages",
                  "image_url":"https://image.shutterstock.com/image-vector/waterless-car-wash-260nw-1353847511.jpg",
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Interior",
                      "payload":"int_wtl"
                    },
                    {
                      "type":"postback",
                      "title":"Exterior",
                      "payload":"ext_wtl"
                    },
                    {
                      "type":"postback",
                      "title":"both",
                      "payload":"both_wtl"
                    },
                  ]

                }
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
          //end of choose one
        }
        //end of washpkg
        if (userButton == 's' || userButton == 'm' || userButton == 'l'){

          if(userButton == 's'){
            userOrder.car = 's';
          }else if(userButton == 'm'){
            userOrder.car = 'm';
          }

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
                  
                    "title":"please choose interior/exterior ?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Interior",
                        "payload":`int_${userButton}`
                      },
                      {
                        "type":"postback",
                        "title":"Exterior",
                        "payload":`ext_${userButton}`
                      },
                      {
                        "type":"postback",
                        "title":"Both",
                        "payload":`both_${userButton}`
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

        if (userButton == 'int_s'|| userButton == 'ext_s' || userButton == 'both_s' || userButton == 'int_m'|| userButton == 'ext_m' || userButton == 'both_m' || userButton == 'int_l'|| userButton == 'ext_l' || userButton == 'both_l'){

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
                  
                    "title":"provide water",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Yes",
                        "payload":`y_${userButton}`
                      },
                      {
                        "type":"postback",
                        "title":"No",
                        "payload":`n_${userButton}`
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

        if (userButton == 'y_int_s'|| userButton == 'y_ext_s' || userButton == 'y_both_s' || userButton == 'y_int_m'|| userButton == 'y_ext_m' || userButton == 'y_both_m' || userButton == 'y_int_l'|| userButton == 'y_ext_l' || userButton == 'y_both_l' || userButton == 'n_int_s'|| userButton == 'n_ext_s' || userButton == 'n_both_s' || userButton == 'n_int_m'|| userButton == 'n_ext_m' || userButton == 'n_both_m' || userButton == 'n_int_l'|| userButton == 'n_ext_l' || userButton == 'n_both_l'){

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
                  
                    "title":"provide water",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Waterless wash",
                        "payload":`wl_${userButton}`
                      },
                      {
                        "type":"postback",
                        "title":"Handwash",
                        "payload":`hw_${userButton}`
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

        if (userButton == 'wl_y_int_s'|| userButton == 'wl_y_ext_s' || userButton == 'wl_y_both_s' || userButton == 'wl_y_int_m'|| userButton == 'wl_y_ext_m' || userButton == 'wl_y_both_m' || userButton == 'wl_y_int_l'|| userButton == 'wl_y_ext_l' || userButton == 'wl_y_both_l' || userButton == 'n_int_s'|| userButton == 'n_ext_s' || userButton == 'n_both_s' || userButton == 'n_int_m'|| userButton == 'n_ext_m' || userButton == 'n_both_m' || userButton == 'n_int_l'|| userButton == 'n_ext_l' || userButton == 'n_both_l' || userButton == 'hw_y_int_s'|| userButton == 'hw_y_ext_s' || userButton == 'hw_y_both_s' || userButton == 'hw_y_int_m'|| userButton == 'hw_y_ext_m' || userButton == 'hw_y_both_m' || userButton == 'hw_y_int_l'|| userButton == 'hw_y_ext_l' || userButton == 'hw_y_both_l'){
          var userName = [] 
          requestify.get(`https://graph.facebook.com/${webhook_event.sender.id}?fields=first_name,last_name&access_token=${pageaccesstoken}`).then(function(success){
            var response = success.getBody();
            console.log(response)
            userName.push(response.first_name);
            userName.push(response.last_name);
            if(userButton.includes('wl_')){
              var title = 'Waterless Wash'
              var text = "Waterless washing method do not use water but it uses an organic and chemical liquids in a spray bottle to clean your glasses and wax your car. It can remove most stains and bird poops. But it can't handle heavy mud or dirt stains which require intense scrubbing" //waterless
              var image = 'https://image.shutterstock.com/image-vector/waterless-car-wash-260nw-1353847511.jpg' //waterless
              var rollback = userButton.split('_')
            rollback.shift()
            rollback = rollback.join('_')
            }else if(userButton.includes('hw_')){
              var title = 'Handwash'
              var text = 'Handwash is a very traditional and common way to cleaning and washing your car. It only requires car washing soaps and uses the water which you will need to provide. It is effective for intense scrub downs of mud and dirt stains' //handwash
              var image = 'https://st2.depositphotos.com/1001951/7088/i/450/depositphotos_70888985-stock-photo-man-worker-washing-cars-alloy.jpg' //handwash
              var rollback = userButton.split('_')
            rollback.shift()
            rollback = rollback.join('_')
            }else {
              var title = 'Waterless wash'
              var text = "Waterless washing method do not use water but it uses an organic and chemical liquids in a spray bottle to clean your glasses and wax your car. It can remove most stains and bird poops. But it can't handle heavy mud or dirt stains which require intense scrubbing" //waterless
              var image = 'https://image.shutterstock.com/image-vector/waterless-car-wash-260nw-1353847511.jpg' //waterless
              var rollback = userButton.split('_')
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
                        //star book
                    
                      "title":title,
                      "image_url": image,
                      "buttons":[
                        {
                          "type":"web_url",
                          "title":"Yes",
                          "url": `mmcarwash.herokuapp.com/wash/${userButton}/${userName.join(' ')}`,
                          "webview_height_ratio":"full"
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
           }).catch(error=>{
             console.log(error)
           })
          
          //end of choose one
        }












      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });