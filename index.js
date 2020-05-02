'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  requestify = require('requestify'),
  app = express() , // creates express http server
  ejs = require("ejs");
 const firebase = require("firebase-admin");
  

  const pageaccesstoken = 'EAAKGyWXj6KABAFtiinMjZAuBLSAqynfEaVfadWlrj9LHI8ZBbveIVSzWSYdpUI91QPoYrcVxcIgHN7v0EWnQfInuit4P6gGpFkVNz9YmYpfPCAlpNk3lsw0vW16mbXxzcZCH7NOdGMaasJ0GH4cter2UqJrhB2irEWBhXW69UGHDTx7ONLS72mtTjWvSI4ZD';
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.set('view engine', 'ejs');
  app.set('views', __dirname+'/views');

  var firebaseConfig = {
    credential: firebase.credential.cert({
   "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
   "client_email": process.env.FIREBASE_CLIENT_EMAIL,
   "project_id": process.env.FIREBASE_PROJECT_ID,    
   }),
   databaseURL: process.env.FIREBASE_DB_URL, 
 };

 
  firebase.initializeApp(firebaseConfig);

  app.use('/img',express.static('img'));  
  app.get('/whitelists',function(req,res){    
    whitelistDomains(res);
  });

  const db = firebase.firestore();

  app.get('/plans/:plan/:name/:id/:month', (req, res) => {
  
    var name = req.params.name;
    var month=req.params.month;
    var plan=req.params.plan;
    var senderID=req.params.id;
    res.render('plans.ejs', {name:name, month:month,plan:plan, id:senderID})
    
  })
  app.post('/plans',function(req,res){
        
        
    let phone= req.body.phone;
    console.log(req.body.add_on0);
    let town = req.body.town;
    let address = req.body.address_info;
    let carplate = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let price=req.body.price;
    let start_date= req.body.startdate;
    let period=req.body.period;
    let end_date= req.body.enddate;
    let day= req.body.day;
    let time= req.body.time_input;
    let id= req.body.sender;
    let Name= req.body.name;
    let plan= req.body.plan;
   let booking_number = generateRandom(5);    
  
    db.collection('Plan Subscriptions').add({
      phone:phone,
      town:town,
      address:address,
      carplate:carplate,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      start_date:start_date,
      period:period,
      end_date:end_date,
      price:price,
      day:day,
      time:time,
      id:id,
      Name:Name,
      plan:plan,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
          showSubscriptionNumber(id, booking_number);   
        }).catch(error => {
          console.log(error);
    });        
  });
  app.get('/plan_view/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Plan Subscriptions").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
  
            let data = {
              doc_id:doc.id,
              phone:doc.data().phone,
              town:doc.data().town,
              address:doc.data().address,
              carplate:doc.data().carplate,
              carbrand:doc.data().carbrand,
              carmodel:doc.data().carmodel,
              carsize:doc.data().carsize,            
              start_date:doc.data().start_date,
              period:doc.data().period,
              end_date:doc.data().end_date,
              price:doc.data().price,
              day:doc.data().day,
              time:doc.data().time,
              id:doc.data().id,
              Name:doc.data().Name,
              plan:doc.data().plan,
              booking_number:doc.data().booking_number,
            }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('plan_view.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });
  app.get('/plan_update/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Plan Subscriptions").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

          let data = {
            doc_id:doc.id,
            phone:doc.data().phone,
            town:doc.data().town,
            address:doc.data().address,
            carplate:doc.data().carplate,
            carbrand:doc.data().carbrand,
            carmodel:doc.data().carmodel,
            carsize:doc.data().carsize,            
            start_date:doc.data().start_date,
            period:doc.data().period,
            end_date:doc.data().end_date,
            price:doc.data().price,
            day:doc.data().day,
            time:doc.data().time,
            id:doc.data().id,
            Name:doc.data().Name,
            plan:doc.data().plan,
            booking_number:doc.data().booking_number,
          }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('plan_update.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });
  app.post('/plan_update',function(req,res){
        
        
    let phone= req.body.phone;
    console.log(req.body.date_input);
    let town = req.body.town;
    let address = req.body.address_info;
    let carplate = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let price=req.body.price;
    let period=req.body.period;
    let start_date= req.body.startdate;
    let time= req.body.time_input;
    let day= req.body.day;
    let end_date= req.body.enddate;
    let id= req.body.sender;
    let Name= req.body.Name;
    let plan= req.body.plan;
    let booking_number = req.body.booking_number; 
    let doc_id = req.body.doc_id; 
    
  
    db.collection('Plan Subscriptions').doc(doc_id).update({
      phone:phone,
      town:town,
      address:address,
      carplate:carplate,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      price:price,
      start_date:start_date,
      period:period,
      time:time,
      day:day,
      end_date:end_date,
      id:id,
      Name:Name,
      plan:plan,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
          Update_Complete(id, booking_number);
        }).catch(error => {
          console.log(error);
    });        
  });
  app.get('/plan_once/:plan/:name/:id', (req, res) => {
  
    var name = req.params.name;
    var plan=req.params.plan;
    var senderID=req.params.id;
    res.render('plan_once.ejs', {name:name,plan:plan, id:senderID})
    
  })
  app.post('/plan_once',function(req,res){
        
        
    let phone= req.body.phone;
    let town = req.body.town;
    let address = req.body.address_info;
    let carplate = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let price=req.body.price;
    let date= req.body.date_input;
    let time= req.body.time_input;
    let id= req.body.sender;
    let name= req.body.name;
    let plan= req.body.plan
   
  
  
  
   let booking_number = generateRandom(5);    
  
    db.collection('Plan Booking').add({
      phone:phone,
      town:town,
      address:address,
      carplate:carplate,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      price:price,
      date:date,
      time:time,
      id:id,
      Name:name,
      plan:plan,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
           showPlanBooking(id, booking_number);   
        }).catch(error => {
          console.log(error);
    });        
  });
  app.get('/plan_once_view/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Plan Booking").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
  
            let data = {
              doc_id:doc.id,
              phone:doc.data().phone,
              town:doc.data().town,
              address:doc.data().address,
              carplate:doc.data().carplate,
              carbrand:doc.data().carbrand,
              carmodel:doc.data().carmodel,
              carsize:doc.data().carsize,            
              date:doc.data().date,
              time:doc.data().time,
              price:doc.data().price,
              id:doc.data().id,
              Name:doc.data().Name,
              plan:doc.data().plan,
              booking_number:doc.data().booking_number,
            }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('plan_once_view.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });
  app.get('/plan_once_update/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Plan Booking").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

          let data = {
            doc_id:doc.id,
            phone:doc.data().phone,
            town:doc.data().town,
            address:doc.data().address,
            carplate:doc.data().carplate,
            carbrand:doc.data().carbrand,
            carmodel:doc.data().carmodel,
            carsize:doc.data().carsize,            
            date:doc.data().date,
            time:doc.data().time,
            price:doc.data().price,
            id:doc.data().id,
            Name:doc.data().Name,
            plan:doc.data().plan,
            booking_number:doc.data().booking_number,
          }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('plan_once_update.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });
  app.post('/plan_once_update',function(req,res){
        
        
    let phone= req.body.phone;
    console.log(req.body.date_input);
    let town = req.body.town;
    let address = req.body.address_info;
    let carplate = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let price=req.body.price;
    let date= req.body.date_input;
    let time= req.body.time_input;
    let id= req.body.sender;
    let Name= req.body.Name;
    let plan= req.body.plan;
    let booking_number = req.body.booking_number; 
    let doc_id = req.body.doc_id; 
   
  
    db.collection('Plan Booking').doc(doc_id).update({
      phone:phone,
      town:town,
      address:address,
      carplate:carplate,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      price:price,
      date:date,
      time:time,
      id:id,
      Name:Name,
      plan:plan,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
           Update_Complete2(id, booking_number);   
        }).catch(error => {
          console.log(error);
    });        
  });

  app.get('/carwash/:washtype/:intorext/:name/:id', (req, res) => {
  
    var name = req.params.name;
    var washType=req.params.washtype;
    var intorext=req.params.intorext;
    var senderID=req.params.id;
    res.render('carwash.ejs', {name:name, washtype:washType,intorext:intorext, id:senderID})
    
  })
  app.post('/carwash',function(req,res){
        
        
    let phone= req.body.phone;
    console.log(req.body.add_on0);
    let town = req.body.town;
    let address = req.body.address_info;
    let carplate = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let pethair  = req.body.add_on0;
    let wax = req.body.add_on1;
    let scratch = req.body.add_on2;  
    let claybar = req.body.add_on3;  
    let tire_alloy = req.body.add_on4;
    let addoncost = req.body.addoncost;
    let total_price=req.body.total;
    let date= req.body.date_input;
    let time= req.body.time_input;
    let id= req.body.sender;
    let Name= req.body.Name;
    let wash_type= req.body.wash_type;
    let int_ext= req.body.int_ext;
   
  
  
  
   let booking_number = generateRandom(5);    
  
    db.collection('Car Wash Booking').add({
      phone:phone,
      town:town,
      address:address,
      carplate:carplate,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      pethair:pethair,
      wax:wax,
      scratch:scratch,
      claybar:claybar,
      tire_alloy:tire_alloy,
      addoncost:addoncost,
      total_price:total_price,
      date:date,
      time:time,
      id:id,
      Name:Name,
      wash_type:wash_type,
      Interior_or_Exterior:int_ext,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
           showBookingNumber(id, booking_number);   
        }).catch(error => {
          console.log(error);
    });        
  });
  app.get('/carwashview/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Car Wash Booking").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
  
            let data = {
              doc_id:doc.id,
              phone:doc.data().phone,
              town:doc.data().town,
              address:doc.data().address,
              carplate:doc.data().carplate,
              carbrand:doc.data().carbrand,
              carmodel:doc.data().carmodel,
              carsize:doc.data().carsize,            
              pethair:doc.data().pethair,
              wax:doc.data().wax,
              scratch:doc.data().scratch,
              claybar:doc.data().claybar,
              tire_alloy:doc.data().tire_alloy,
              total_price:doc.data().total_price,
              date:doc.data().date,
              time:doc.data().time,
              id:doc.data().id,
              Name:doc.data().Name,
              wash_type:doc.data().wash_type,
              Interior_or_Exterior:doc.data().Interior_or_Exterior,
              booking_number:doc.data().booking_number,
            }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('carwashview.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });

  app.get('/carwash_update/:booking_number/:sender_id/',function(req,res){
    const sender_id = req.params.sender_id;
    const booking_number = req.params.booking_number;
  
  
    db.collection("Car Wash Booking").where("booking_number", "==", booking_number)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            let data = {
              doc_id:doc.id,
              phone:doc.data().phone,
              town:doc.data().town,
              address:doc.data().address,
              carplate:doc.data().carplate,
              carbrand:doc.data().carbrand,
              carmodel:doc.data().carmodel,
              carsize:doc.data().carsize,            
              pethair:doc.data().pethair,
              wax:doc.data().wax,
              scratch:doc.data().scratch,
              claybar:doc.data().claybar,
              tire_alloy:doc.data().tire_alloy,
              addoncost:doc.data().addoncost,
              total_price:doc.data().total_price,
              date:doc.data().date,
              time:doc.data().time,
              id:doc.data().id,
              Name:doc.data().Name,
              wash_type:doc.data().wash_type,
              Interior_or_Exterior:doc.data().Interior_or_Exterior,
              booking_number:doc.data().booking_number,
            }   
  
            console.log("BOOKING DATA", data);     
  
           res.render('carwash_update.ejs',{data:data, sender_id:sender_id});
            
  
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
  });
  app.post('/carwash_update',function(req,res){
        
        
    let phone= req.body.phone;
    console.log(req.body.date_input);
    let town = req.body.town;
    let address = req.body.address_info;
    let carpalte = req.body.car_plate;
    let carbrand = req.body.car_brand;
    let carmodel = req.body.car_model;
    let carsize= req.body.carsize;
    let pethair  = req.body.add_on0;
    let wax = req.body.add_on1;
    let scratch = req.body.add_on2;  
    let claybar = req.body.add_on3;  
    let tire_alloy = req.body.add_on4;
    let addoncost = req.body.addoncost;
    let total_price=req.body.total;
    let date= req.body.date_input;
    let time= req.body.time_input;
    let id= req.body.sender;
    let Name= req.body.Name;
    let wash_type= req.body.wash_type;
    let int_ext= req.body.int_ext;
    let booking_number = req.body.booking_number; 
    let doc_id = req.body.doc_id; 
   
  
    db.collection('Car Wash Booking').doc(doc_id).update({
      phone:phone,
      town:town,
      address:address,
      carpalte:carpalte,
      carbrand:carbrand,
      carmodel:carmodel,
      carsize:carsize,            
      pethair:pethair,
      wax:wax,
      scratch:scratch,
      claybar:claybar,
      tire_alloy:tire_alloy,
      addoncost:addoncost,
      total_price:total_price,
      date:date,
      time:time,
      id:id,
      Name:Name,
      wash_type:wash_type,
      Interior_or_Exterior:int_ext,
      booking_number:booking_number,
        }).then(success => {             
          console.log("DATASAVESHOWBOOKINGNUMBER");     
           Update_Complete1(id, booking_number);   
        }).catch(error => {
          console.log(error);
    });        
  });
  
  
  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));



// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "aungchannoo"
      
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
                    "image_url":'https://st2.depositphotos.com/1001951/7088/i/450/depositphotos_70888985-stock-photo-man-worker-washing-cars-alloy.jpg' ,
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
                    "image_url":'https://image.shutterstock.com/image-vector/waterless-car-wash-260nw-1353847511.jpg',
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
      console.log(userInput);
      if(userInput.includes("/int")){
        
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
      "text": "What's in the plan🧐:\nExterior body wash✔️\nRims & Tire Shine✔️\n💰Price💰:\n💵💵1Month💵💵\n🚗Small-15000Ks\n🚗Medium-25000Ks\n🚗Large-35000Ks\n💵💵2Month💵💵\n🚗Small-25000Ks\n🚗Medium-35000Ks\n🚗Large-45000Ks\n💵💵3Month💵💵\n🚗Small-35000Ks\n🚗Medium-45000Ks\n🚗Large-55000Ks"
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
      "text": "What's in the plan:\nExterior body wash✔️Rims & Tire Shine✔️Interior Vacuum✔️Wipe all Surfaces✔️Interior Windows✔️\n💰Price💰:\n💵💵1Month💵💵\n🚗Small-15000Ks\n🚗Medium-25000Ks\n🚗Large-35000Ks\n💵💵2Month💵💵\n🚗Small-25000Ks\n🚗Medium-35000Ks\n🚗Large-45000Ks\n💵💵3Month💵💵\n🚗Small-35000Ks\n🚗Medium-45000Ks\n🚗Large-55000Ks"
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
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️\n💰Price💰:\n💵💵1Month💵💵\n🚗Small-15000Ks\n🚗Medium-25000Ks\n🚗Large-35000Ks\n💵💵2Month💵💵\n🚗Small-25000Ks\n🚗Medium-35000Ks\n🚗Large-45000Ks\n💵💵3Month💵💵\n🚗Small-35000Ks\n🚗Medium-45000Ks\n🚗Large-55000Ks"
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
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️\nClay bar polish✔️\nHard Coat Hand Wax✔️\n💰Price💰:\n💵💵1Month💵💵\n🚗Small-15000Ks\n🚗Medium-25000Ks\n🚗Large-35000Ks\n💵💵2Month💵💵\n🚗Small-25000Ks\n🚗Medium-35000Ks\n🚗Large-45000Ks\n💵💵3Month💵💵\n🚗Small-35000Ks\n🚗Medium-45000Ks\n🚗Large-55000Ks"
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
      "text": "What's in the plan:\nExterior Hand Wash✔️\nRims & Tire Shine✔️\nInterior Vacuum✔️\nWipe all Surfaces✔️\nInterior Windows✔️\nLeather Clean & Condition✔️\nLight Carpet Clean & Stain Removal✔️\nDashboard Condition✔️\nClay bar polish✔️\nHard Coat Hand Wax✔️\nPaint Polish and Hybrid Ceramic Sealant✔️\nExterior Plastic Dressing w/ UV Protection✔️\n💰Price💰:\n💵💵1Month💵💵\n🚗Small-15000Ks\n🚗Medium-25000Ks\n🚗Large-35000Ks\n💵💵2Month💵💵\n🚗Small-25000Ks\n🚗Medium-35000Ks\n🚗Large-45000Ks\n💵💵3Month💵💵\n🚗Small-35000Ks\n🚗Medium-45000Ks\n🚗Large-55000Ks"
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

if(userInput.includes("Car Wash Booking:")){
  let ref_num = userInput.slice(17);
  ref_num = ref_num.trim(); 
  console.log(ref_num);
  var senderID = webhook_event.sender.id;
  console.log(senderID);
  let genericMessage ={
    "recipient":{
      "id": senderID
    },
    "message":{
      "attachment":{
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "You are viewing your booking number: " + ref_num,                       
          "buttons": [              
            {
              "type": "web_url",
              "title": "View",
              "url":"https://mmcarwash.herokuapp.com/carwashview/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            {
              "type": "web_url",
              "title": "Update",
              "url":"https://mmcarwash.herokuapp.com/carwash_update/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            
          ],
        }]
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
if(userInput.includes("Subscribed Plan:")){
  let ref_num = userInput.slice(16);
  ref_num = ref_num.trim(); 
  console.log(ref_num);
  var senderID = webhook_event.sender.id;
  console.log(senderID);
  let genericMessage ={
    "recipient":{
      "id": senderID
    },
    "message":{
      "attachment":{
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "You are viewing your Subscription ID: " + ref_num,                       
          "buttons": [              
            {
              "type": "web_url",
              "title": "View",
              "url":"https://mmcarwash.herokuapp.com/plan_view/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            {
              "type": "web_url",
              "title": "Update",
              "url":"https://mmcarwash.herokuapp.com/plan_update/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            
          ],
        }]
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
if(userInput.includes("Booked Plan:")){
  let ref_num = userInput.slice(12);
  ref_num = ref_num.trim(); 
  console.log(ref_num);
  var senderID = webhook_event.sender.id;
  console.log(senderID);
  let genericMessage ={
    "recipient":{
      "id": senderID
    },
    "message":{
      "attachment":{
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "You are viewing your Booked Plan ID: " + ref_num,                       
          "buttons": [              
            {
              "type": "web_url",
              "title": "View",
              "url":"https://mmcarwash.herokuapp.com/plan_once_view/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            {
              "type": "web_url",
              "title": "Update",
              "url":"https://mmcarwash.herokuapp.com/plan_once_update/"+ref_num+"/"+senderID,
               "webview_height_ratio": "full",
              "messenger_extensions": true,          
            },
            
          ],
        }]
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
//start price
if(userInput=="price"){
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
              "title":"Which Prices do you want to know",
              "buttons":[
                {
                "type":"postback",
                "title":"Normal Car Wash",
                "payload":"ncw"
                },
                {
                  "type":"postback",
                  "title":"Plan Subscription Price",
                  "payload":"psp"
                },
                {
                  "type":"postback",
                  "title":"Plan Booking",
                  "payload":"pb"
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
if(userInput=="ncw"){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Here are our availiable car washes and their prices:"
    }
  };
  requestify.get(`https://graph.facebook.com/v6.0/${webhook_event.sender.id}?fields=name&access_token=${pageaccesstoken}`).then(success=>{

  var udetails = JSON.parse(success.body);
  var senderID = webhook_event.sender.id;
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
              "title":"Normal Regular Handwash-Interior",
              "subtitle":"Require to provide water!\nSmall-3000Ks\nMedium-4000Ks\nLarge-5000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/regular/int/"+udetails.name+"/"+senderID,
                  "title":"Book this",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
              ]
            },
            {
              "title":"Normal Regular Handwash-Exterior",
              "subtitle":"Require to provide water!\nSmall-3000Ks\nMedium-4000Ks\nLarge-5000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/regular/int/"+udetails.name+"/"+senderID,
                  "title":"Book this",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
              ]
            },
            {
              "title":"Normal Regular Handwash-Both",
              "subtitle":"Require to provide water!\nSmall-5000Ks\nMedium-7000Ks\nLarge-9000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/regular/int/"+udetails.name+"/"+senderID,
                  "title":"Book this",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
              ]
            },
            {
              "title":"Normal Waterless Wash-Interior",
              "subtitle":"Small-4000Ks\nMedium-5000Ks\nLarge-6000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/waterless/int/"+udetails.name+"/"+senderID,
                  "title":"Book this",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
              ]
            },
            {
              "title":"Normal Waterless Wash-Exterior",
              "subtitle":"Small-4000Ks\nMedium-5000Ks\nLarge-6000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/waterless/ext/"+udetails.name+"/"+senderID,
                  "title":"Book this",
                  "messenger_extensions":true,
                  "webview_height_ratio": "full",
                },
              ]
            },
            {
              "title":"Normal Waterless Wash-Both",
              "subtitle":"Small-7000Ks\nMedium-9000Ks\nLarge-11000Ks",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://mmcarwash.herokuapp.com/carwash/waterless/both/"+udetails.name+"/"+senderID,
                  "title":"Book this",
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
if(userInput=="psp"){
  let textMessage = {
    "recipient":{
      "id":webhook_event.sender.id
    },
    "message":{
      "text": "Here are our availiable plans and their subscription prices:"
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
              "title":"Bronze Plan",
              "image_url":"https://i.pinimg.com/564x/4e/7a/79/4e7a79bc31c39cdc0ea944a6a618ac9b.jpg",
              "subtitle":"View Details to check out the prices and more.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"View Detail",
                  "payload":"bronze"
                  },
              ]
            },
            {
              "title":"Silver Plan",
              "image_url":"https://i.pinimg.com/564x/2b/a4/c0/2ba4c00cb92f1b6b9e77ab9c84b77a1d.jpg",
              "subtitle":"View Details to check out the prices and more.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"View detail",
                  "payload":"silver"
                  },
              ]
            },
            {
              "title":"Gold Plan",
              "image_url":"https://i.pinimg.com/564x/c9/25/62/c9256251709a5bbdf864f8243cdbec3d.jpg",
              "subtitle":"View Details to check out the prices and more.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"View detail",
                  "payload":"gold"
                  },
              ]
            },
            {
              "title":"Platinum Plan",
              "image_url":"https://i.pinimg.com/564x/ec/2f/83/ec2f8388521c3f956a1379736c3fd08c.jpg",
              "subtitle":"View Details to check out the prices and more.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"View detail",
                  "payload":"platinum"
                  },
              ]
            },
            {
              "title":"Diamond Plan",
              "image_url":"https://i.pinimg.com/564x/4a/37/83/4a378324e74f0196c76101ad37b90875.jpg",
              "subtitle":"View Details to check out the prices and more.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"View detail",
                  "payload":"diamond"
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

      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
      
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
  const generateRandom = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const showBookingNumber = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is saved. Please keep your booking reference ID ${ref}.\nCar Wash Booking:${ref} to view or update your car wash booking`
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
  const showSubscriptionNumber = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is saved. Please keep your subscription reference ID is ${ref}\nSender us "Subscribed Plan: ${ref}" to view or update your subscription`
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
  const showPlanBooking = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is saved. Please keep your subscription reference, ID is ${ref}\nSender us "Booked Plan: ${ref}" to view or update your subscription`
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
  const Update_Complete = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is updated. Please keep your subscription reference ID is ${ref}\nSender us "Subscribed Plan: ${ref}" to view or update your subscription`
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
  const Update_Complete1 = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is updated. Please keep your subscription reference ID is ${ref}\nSender us "Car Wash Booking: ${ref}" to view or update your subscription`
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
  const Update_Complete2 = (sender_psid,ref) => { 
    let textMessage = {
      "recipient":{
        "id": sender_psid
      },
      "message":{
        "text": `Your data is updated. Please keep your subscription reference ID is ${ref}\nSender us "Booked Plan: ${ref}" to view or update your subscription`
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
  /***********************************
FUNCTION TO ADD WHITELIST DOMAIN
************************************/

const whitelistDomains = (res) => {
  var messageData = {
          "whitelisted_domains": [
           "https://mmcarwash.herokuapp.com/" , 
           "https://herokuapp.com/" ,
           "https://mmcarwash.herokuapp.com/carwash/" ,
           "https://mmcarwash.herokuapp.com/plans/"   ,
           "https://mmcarwash.herokuapp.com/view/"  ,
           "https://i.pinimg.com/"    
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