const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required:true
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);
const cart = mongoose.model("Cart", cartSchema);
module.exports = cart;

