const Cart = require('../models/Cart');
const Item = require('../models/Item');


 async function processUsers(cart) {
    let result = [];

     for(var i=0;i<cart.length;i++){
        let item=  await Item.findOne({_id: cart[i].productId})
        result.push(item);
     }
    return result;
}

module.exports.get_cart_items = async (req,res) => {
    const userId = req.params.id;
    try{


        let cart = await Cart.findOne({userId});
        let result=await processUsers(cart.items)
        // cart.newArr.push(result);
        // console.log( cart)
        // console.log(cart.items.length)
        // console.log("result"+result.length)

        // cart=[...cart,result]

        // if(cart && cart.items.length>0){
        //     for(var i=0;i<cart.items.length;i++){
        //         var drugName=result[i].drug_name;
        //         cart={...cart.items[i],drugName}
        //     }
        // }
        
        // for (const c in cart) {
        //     console.log(c)
        //   }

       
        // let promises=[];
        //  await cart.items.forEach((item)=>{
        //    Item.findOne({_id: item.productId}).then(function(item){
        //         console.log("hhasdfjlsadfhalsjkdhf")
        //         promises.push(item);
        //         // itemData.push(item)
        //             });
        // })
        //  result= Promise.all(promises)
            // console.log("result"+ result)
        
        if(cart && cart.items.length>0){
            // console.log(cart.items)
            // let itemData=[];
            // await cart.items.map((item)=>{
            //    Item.findOne({_id: item.productId}).then(function(item){
            //         console.log("hhasdfjlsadfhalsjkdhf")
            //         itemData=[...itemData,item];

            //         // itemData.push(item)
            //             });
            // })
            
            // console.log(cart)

            res.send({cart,result});
        }
        else{
            res.send(null);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
// 
// module.exports.get_item = (req,res) => {
//     console.log("hiii")
//     console.log(req.params.id)
//     // Item.findById({_id:req.params.id}).then(function(item){
//     //     console.log(item);
//     //     res.json("a");
//     // });
//     Item.findOne({_id: req.params.id}).then(function(item){
//         console.log(item);
//         return res.json(item);
//     });
// }


module.exports.add_cart_item = async (req,res) => {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found!')
        }
        const price = item.price;
        const name = item.title;
        
        if(cart){
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).send(cart);
        }
        else{
            // no cart exists, create one
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, quantity, price }],
                bill: quantity*price
            });
            return res.status(201).send(newCart);
        }       
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.update_cart_item = async (req, res) => {
    const userId = req.params.id;
    const { productId, qty } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});

        if(!item)
            return res.status(404).send('Item not found!'); // not returning will continue further execution of code.
        
        if(!cart)
          return res.status(400).send("Cart not found");
        else{
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex == -1)
              return res.status(404).send('Item not found in cart!');
            else {
                let productItem = cart.items[itemIndex];
                productItem.quantity = qty;
                cart.items[itemIndex] = productItem;
            }
            cart.bill = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
            cart = await cart.save();
            return res.status(201).send(cart);
        }     
    }
    catch (err) {
        // just printing the error wont help us find where is the error. Add some understandable string to it.
        console.log("Error in update cart", err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.delete_item = async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.itemId;
    try{
        let cart = await Cart.findOne({userId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.items.splice(itemIndex,1);
        }
        cart = await cart.save();
        return res.status(201).send(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
