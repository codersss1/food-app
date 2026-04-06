import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
    },
    description: {
      type: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
export default MenuCategory;
