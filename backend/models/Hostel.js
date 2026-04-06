import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hostel name is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    deliveryZone: {
      type: String,
      enum: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
      required: [true, 'Delivery zone is required'],
    },
    deliveryFee: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;
