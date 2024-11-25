const mongoose = require('mongoose');


const HouseSchema = mongoose.Schema(
  {
    visibility:Boolean,
    Etage: {
    type: Number,
    required: true
  },
  Salon: {
    type: Number,
    required: true
  },
  Byout: {
    type: Number,
    required: true
  },
  toillete: {
    type: Number,
    required: true
  },
  koujina: {
    type: Number,
    required: true
  },
  
  meuble: {
    type: Boolean,
    default: false
  },
  balcon: {
    type: Boolean,
    default: false
  },
  jarda: {
    type: Boolean,
    default: false
  },
  gaz: {
    type: Boolean,
    default: false
  },
  climatiseur: {
    type: Boolean,
    default: false
  },
  houseType:String,
  lchkon :String,
  wilaya : String,
  mo3tamdiya : String,
  houma : String,
  griba : String,
  prix : Number,
  prixOption:String,
  images: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  

  const HouseModel = mongoose.model('House', HouseSchema);

  module.exports = HouseModel;