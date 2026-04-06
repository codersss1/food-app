-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'phone', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- SEED DATA

-- Insert Hostels
INSERT INTO public.hostels (name, address, delivery_zone, delivery_fee) VALUES
  ('Boys Hostel A', 'LPU Campus, Jalandhar', 'Zone A', 0),
  ('Boys Hostel B', 'LPU Campus, Jalandhar', 'Zone A', 0),
  ('Girls Hostel A', 'LPU Campus, Jalandhar', 'Zone B', 0),
  ('Girls Hostel B', 'LPU Campus, Jalandhar', 'Zone B', 0),
  ('Day Scholar Area', 'LPU Campus, Jalandhar', 'Zone C', 30)
ON CONFLICT (name) DO NOTHING;

-- Insert Restaurants
INSERT INTO public.restaurants (name, description, cuisine_type, rating, delivery_time, minimum_order, delivery_fee, image_url, opening_time, closing_time) VALUES
  ('Spice Route', 'North Indian & Chinese', 'Indian', 4.7, 25, 150, 0, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop', '10:00'::time, '23:00'::time),
  ('Pizza Palace', 'Fresh Pizzas & Pastas', 'Italian', 4.5, 20, 200, 0, 'https://images.unsplash.com/photo-1552895573-8beb9f005603?w=500&h=300&fit=crop', '11:00'::time, '23:30'::time),
  ('Burger Junction', 'Burgers, Fries & Shakes', 'Fast Food', 4.4, 15, 100, 0, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop', '10:00'::time, '23:00'::time),
  ('Biryani House', 'Authentic Biryani & Kebabs', 'Indian', 4.8, 30, 200, 0, 'https://images.unsplash.com/photo-1589985643862-f706e82e7ef5?w=500&h=300&fit=crop', '11:00'::time, '22:30'::time),
  ('Paneer Express', 'Vegetarian North Indian', 'Indian', 4.6, 20, 100, 0, 'https://images.unsplash.com/photo-1585521922769-665dcc76993d?w=500&h=300&fit=crop', '10:30'::time, '22:30'::time),
  ('Momos Magic', 'Momos, Noodles & Soups', 'Chinese', 4.3, 18, 80, 0, 'https://images.unsplash.com/photo-1585521922769-665dcc76993d?w=500&h=300&fit=crop', '10:00'::time, '23:00'::time),
  ('Shake Master', 'Milkshakes & Ice Creams', 'Desserts', 4.5, 10, 50, 0, 'https://images.unsplash.com/photo-1553530666-ba953a5ad488?w=500&h=300&fit=crop', '10:00'::time, '23:30'::time),
  ('Thai Paradise', 'Thai & Asian Cuisine', 'Asian', 4.6, 25, 150, 0, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop', '11:00'::time, '22:30'::time)
ON CONFLICT DO NOTHING;

-- Get restaurant IDs for menu insertion
-- Insert Menu Categories & Items
DO $$
DECLARE
  spice_route_id UUID;
  pizza_palace_id UUID;
  burger_junction_id UUID;
BEGIN
  -- Get restaurant IDs
  SELECT id INTO spice_route_id FROM public.restaurants WHERE name = 'Spice Route' LIMIT 1;
  SELECT id INTO pizza_palace_id FROM public.restaurants WHERE name = 'Pizza Palace' LIMIT 1;
  SELECT id INTO burger_junction_id FROM public.restaurants WHERE name = 'Burger Junction' LIMIT 1;

  -- Spice Route Menu
  IF spice_route_id IS NOT NULL THEN
    INSERT INTO public.menu_categories (restaurant_id, name, display_order) VALUES
      (spice_route_id, 'Non-Veg Starters', 1),
      (spice_route_id, 'Veg Starters', 2),
      (spice_route_id, 'Main Course', 3),
      (spice_route_id, 'Breads', 4),
      (spice_route_id, 'Rice & Biryani', 5),
      (spice_route_id, 'Beverages', 6)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_vegetarian) VALUES
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Non-Veg Starters' LIMIT 1), 'Chicken 65', 'Crispy fried chicken', 180, FALSE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Non-Veg Starters' LIMIT 1), 'Fish Tikka', 'Grilled fish tikka', 220, FALSE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Veg Starters' LIMIT 1), 'Paneer Tikka', 'Grilled paneer cubes', 150, TRUE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Veg Starters' LIMIT 1), 'Veg Samosa', 'Crispy samosa (pair)', 60, TRUE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Main Course' LIMIT 1), 'Butter Chicken', 'Creamy tomato-based curry', 280, FALSE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Main Course' LIMIT 1), 'Dal Makhni', 'Creamy lentil curry', 200, TRUE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Breads' LIMIT 1), 'Naan', 'Plain butter naan', 50, TRUE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Breads' LIMIT 1), 'Paratha', 'Butter paratha', 60, TRUE),
      (spice_route_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = spice_route_id AND name = 'Beverages' LIMIT 1), 'Masala Chai', 'Hot masala tea', 30, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Pizza Palace Menu
  IF pizza_palace_id IS NOT NULL THEN
    INSERT INTO public.menu_categories (restaurant_id, name, display_order) VALUES
      (pizza_palace_id, 'Pizzas', 1),
      (pizza_palace_id, 'Pastas', 2),
      (pizza_palace_id, 'Salads', 3),
      (pizza_palace_id, 'Desserts', 4),
      (pizza_palace_id, 'Beverages', 5)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_vegetarian) VALUES
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Pizzas' LIMIT 1), 'Margherita', 'Fresh mozzarella & basil', 280, TRUE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Pizzas' LIMIT 1), 'Pepperoni', 'Spicy pepperoni', 320, FALSE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Pizzas' LIMIT 1), 'Veggie Supreme', 'Mixed vegetables', 300, TRUE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Pastas' LIMIT 1), 'Penne Arrabbiata', 'Spicy tomato sauce', 250, TRUE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Pastas' LIMIT 1), 'Fettuccine Alfredo', 'Creamy parmesan sauce', 280, TRUE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Desserts' LIMIT 1), 'Tiramisu', 'Classic Italian dessert', 120, TRUE),
      (pizza_palace_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = pizza_palace_id AND name = 'Beverages' LIMIT 1), 'Coca Cola', 'Cold drink', 50, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Burger Junction Menu
  IF burger_junction_id IS NOT NULL THEN
    INSERT INTO public.menu_categories (restaurant_id, name, display_order) VALUES
      (burger_junction_id, 'Burgers', 1),
      (burger_junction_id, 'Sandwiches', 2),
      (burger_junction_id, 'Fries & Sides', 3),
      (burger_junction_id, 'Shakes', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_vegetarian) VALUES
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Burgers' LIMIT 1), 'Classic Burger', 'Beef patty with vegetables', 150, FALSE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Burgers' LIMIT 1), 'Double Cheese Burger', 'Two patties with cheese', 200, FALSE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Burgers' LIMIT 1), 'Veggie Burger', 'Plant-based patty', 140, TRUE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Fries & Sides' LIMIT 1), 'French Fries', 'Crispy golden fries', 80, TRUE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Fries & Sides' LIMIT 1), 'Chicken Nuggets', 'Crispy nuggets', 120, FALSE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Shakes' LIMIT 1), 'Chocolate Shake', 'Rich chocolate shake', 100, TRUE),
      (burger_junction_id, (SELECT id FROM public.menu_categories WHERE restaurant_id = burger_junction_id AND name = 'Shakes' LIMIT 1), 'Vanilla Shake', 'Creamy vanilla', 100, TRUE)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert Promo Codes for Students
INSERT INTO public.promo_codes (code, discount_type, discount_value, max_discount_amount, minimum_order_amount, is_for_lpu_students, valid_till) VALUES
  ('WELCOME50', 'percentage', 50, 150, 300, TRUE, NOW() + INTERVAL '30 days'),
  ('STUDENT20', 'percentage', 20, 100, 200, TRUE, NOW() + INTERVAL '60 days'),
  ('HOSTEL100', 'flat', 100, 100, 500, TRUE, NOW() + INTERVAL '45 days'),
  ('FIRST200', 'flat', 200, 200, 400, TRUE, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;
