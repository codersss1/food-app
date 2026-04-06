import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    cuisineType: {
      type: [String],
      required: [true, 'Cuisine type is required'],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
    },
    minimumOrder: {
      type: Number,
      default: 100,
    },
    deliveryFee: {
      type: Number,
      default: 40,
    },
    image: {
      type: String,
      required: [true, 'Restaurant image is required'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      required: [true, 'Opening time is required'],
    },
    closingTime: {
      type: String,
      required: [true, 'Closing time is required'],
    },
    isAvailableForLpu: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
