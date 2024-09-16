const express = require("express");
const app = express();
app.use(express.json());

let orderIdCounter = 0; // global order counter for id
const dataBank = []; // we have db at home

//create a new order
app.post("/orders",(req, res) => {
  let orderId = orderIdCounter++;
  try{
    const order = {
      orderId : orderId,
      customerId: orderId+1,
      productId: orderId+2,
      quantity: 3,
    };
    dataBank.push(order);
    console.log("order created");//testing, pls remove in final
    res.json(order);
  }catch{
    console.log("order not created"); //testing, pls remove in final
    res.json(500)
  }
});


//get an order
app.get("/orders/:orderId", (req, res) => {
  const order = dataBank[req.params.orderId]
  if(!order){ //checks if an order isn't found
    res.status(404).send("order not found");
  }else{
    res.json(order);
  }
});

//update an order
app.put("/orders/:orderId", (req, res) => {
  let order = dataBank[req.params.orderId]
  if(!order ){ //checks if an order isn't found
    res.status(404).send("order not found");
  }else if(req.body.orderId != req.params.orderId){ //checks if order in parameters is the same as in the body
    res.status(400).send("ID mismatch, please check again");
  }else{
    order = req.body
    dataBank[req.params.orderId] = order
    res.json(order);
  }
});

//delete an order
app.delete("/orders/:orderId", (req, res) => {
  let order = dataBank[req.params.orderId];
  if(!order ){ //checks if an order isn't found
    res.status(404).send("order not found");
  }else{
    dataBank.splice(req.params.orderId, 1);// removes orderID
    orderIdCounter--;// reduces global counter for orderID
    //goes from current index to the end of the list to change the orderId 
    //might remove later
    for(let i = req.params.orderId; i < dataBank.length; i++){
      dataBank[i].orderId = parseInt(i);
      //console.log('changed index ' + i); //used for testing, pls remove on final
    }
    res.send("order deleted");
  }
});

app.listen(3003, () => console.log("Order service listening on port 3003!"));
