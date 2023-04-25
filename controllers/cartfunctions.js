
module.exports={
    
 totalCartAmount:(requiredCartData)=>{
  

    total=requiredCartData.reduce((acc,curr)=>{
      return acc+curr.totalPrice
    },0)
    return total;
  
  }
}