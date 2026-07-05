/* ==========================================================
   KARACHI PIZZA & FAST FOOD — DEFAULT MENU DATA
   Structure: each item = { id, name, category, small, medium, large }
   If an item has only one price, it's stored in `small` and
   medium/large are null. Prices are in PKR (Rs).
   ========================================================== */

const DEFAULT_CATEGORIES = [
  "BBQ",
  "Karahi",
  "Handi (Boneless)",
  "Broast",
  "Pizza",
  "Shakes & Ice Cream",
  "Burgers",
  "Biryani & Pulao",
  "Rolls & Shawarma",
  "French Fries"
];

function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

const DEFAULT_MENU = [
  // ---------------- BAR B Q ----------------
  { id: uid("m"), category: "BBQ", name: "Chicken Tikka Breast Piece", small: 399, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Chicken Tikka Leg Piece", small: 399, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Chicken Tikka Boti Boneless", small: 450, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Malai Boti Boneless", small: 499, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Beef Boti", small: 450, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Seekh Kabab (6 pcs)", small: 499, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Reshmi Kabab (6 pcs)", small: 499, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Namkeen Tikka Chicken", small: 499, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Namkeen Afghani Beef Boti Seekh", small: 200, medium: null, large: null },
  { id: uid("m"), category: "BBQ", name: "Grill Fish BBQ (Seasonal)", small: 0, medium: null, large: null },

  // ---------------- KARAHI ----------------
  { id: uid("m"), category: "Karahi", name: "Chicken Karahi (Full)", small: 1999, medium: null, large: null },
  { id: uid("m"), category: "Karahi", name: "Chicken Karahi (Half)", small: 999, medium: null, large: null, popular: true },
  { id: uid("m"), category: "Karahi", name: "Beef Karahi (Full)", small: 2499, medium: null, large: null },
  { id: uid("m"), category: "Karahi", name: "Beef Karahi (Half)", small: 1199, medium: null, large: null },
  { id: uid("m"), category: "Karahi", name: "Mutton Karahi (Full)", small: 3499, medium: null, large: null },
  { id: uid("m"), category: "Karahi", name: "Mutton Karahi (Half)", small: 1899, medium: null, large: null },

  // ---------------- HANDI (BONELESS) ----------------
  { id: uid("m"), category: "Handi (Boneless)", name: "Chicken Handi (Full)", small: 2000, medium: null, large: null },
  { id: uid("m"), category: "Handi (Boneless)", name: "Chicken Handi (Half)", small: 1000, medium: null, large: null },
  { id: uid("m"), category: "Handi (Boneless)", name: "Beef Handi (Full)", small: 1999, medium: null, large: null },
  { id: uid("m"), category: "Handi (Boneless)", name: "Beef Handi (Half)", small: 1199, medium: null, large: null },
  { id: uid("m"), category: "Handi (Boneless)", name: "Mutton Handi (Full)", small: 3299, medium: null, large: null },
  { id: uid("m"), category: "Handi (Boneless)", name: "Mutton Handi (Half)", small: 1599, medium: null, large: null },

  // ---------------- BROAST (New) ----------------
  { id: uid("m"), category: "Broast", name: "Full Broast (8 pcs)", small: 1799, medium: null, large: null, popular: true },
  { id: uid("m"), category: "Broast", name: "Half Broast (4 pcs)", small: 899, medium: null, large: null },
  { id: uid("m"), category: "Broast", name: "Broast (2 pcs)", small: 399, medium: null, large: null },

  // ---------------- PIZZA (Small / Medium / Large) ----------------
  { id: uid("m"), category: "Pizza", name: "Crown Crust Pizza", small: 1499, medium: null, large: 1999 },
  { id: uid("m"), category: "Pizza", name: "Lazania Pizza", small: 1699, medium: null, large: 2199 },
  { id: uid("m"), category: "Pizza", name: "Malai Boti Pizza", small: 450, medium: 1099, large: 1799, popular: true },
  { id: uid("m"), category: "Pizza", name: "Fajita Pizza", small: 450, medium: 950, large: 1550 },
  { id: uid("m"), category: "Pizza", name: "Tikka Pizza", small: 499, medium: 999, large: 1499 },
  { id: uid("m"), category: "Pizza", name: "Supreme Pizza", small: 450, medium: 999, large: 1599 },
  { id: uid("m"), category: "Pizza", name: "Hot & Spicy Pizza", small: 499, medium: 999, large: 1499 },
  { id: uid("m"), category: "Pizza", name: "KBS Pizza", small: 599, medium: 1199, large: 1899 },
  { id: uid("m"), category: "Pizza", name: "Extra Toppings", small: 150, medium: 250, large: 350 },

  // ---------------- SHAKES & ICE CREAM ----------------
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Mango Juice", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Banana Juice", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Apple Juice", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Strawberry Juice", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Sada Ice Cream", small: 150, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Special Ice Cream (1 Pista, 2 Kulfa)", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Strawberry Ice Cream", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Shakes & Ice Cream", name: "Special Falooda", small: 250, medium: null, large: null },

  // ---------------- BURGERS ----------------
  { id: uid("m"), category: "Burgers", name: "KBS Special Pizza Burger", small: 499, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Zinger Burger", small: 350, medium: null, large: null, popular: true },
  { id: uid("m"), category: "Burgers", name: "Zinger Cheese Burger", small: 400, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Chicken Grill Burger", small: 300, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Chicken Grill Cheese Burger", small: 350, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Classic Chicken Burger", small: 300, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Classic Chicken Cheese Burger", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Beef Patti Burger", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Burgers", name: "Beef Patti Cheese Burger", small: 300, medium: null, large: null },

  // ---------------- BIRYANI & PULAO ----------------
  { id: uid("m"), category: "Biryani & Pulao", name: "Chicken Biryani (Full)", small: 400, medium: null, large: null, popular: true },
  { id: uid("m"), category: "Biryani & Pulao", name: "Chicken Biryani (Half)", small: 200, medium: null, large: null },
  { id: uid("m"), category: "Biryani & Pulao", name: "Chicken Biryani (Sada)", small: 100, medium: null, large: null },
  { id: uid("m"), category: "Biryani & Pulao", name: "Beef Pulao (Full)", small: 500, medium: null, large: null },
  { id: uid("m"), category: "Biryani & Pulao", name: "Beef Pulao (Half)", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Biryani & Pulao", name: "Sada Pulao", small: 150, medium: null, large: null },

  // ---------------- ROLLS & SHAWARMA ----------------
  { id: uid("m"), category: "Rolls & Shawarma", name: "Chicken Shawarma", small: 200, medium: null, large: null, popular: true },
  { id: uid("m"), category: "Rolls & Shawarma", name: "Chicken Cheese Shawarma", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Rolls & Shawarma", name: "Shawarma Platter", small: 350, medium: null, large: null },
  { id: uid("m"), category: "Rolls & Shawarma", name: "Chicken Tikka Roll", small: 250, medium: null, large: null },
  { id: uid("m"), category: "Rolls & Shawarma", name: "Beef Garlic Roll", small: 250, medium: null, large: null },

  // ---------------- FRENCH FRIES ----------------
  { id: uid("m"), category: "French Fries", name: "KBS Pizza Fries", small: 599, medium: null, large: null },
  { id: uid("m"), category: "French Fries", name: "Loaded Fries", small: 499, medium: null, large: null, popular: true },
  { id: uid("m"), category: "French Fries", name: "Masala Fries", small: 250, medium: null, large: null },
  { id: uid("m"), category: "French Fries", name: "Masala Cheese Fries", small: 300, medium: null, large: null },
  { id: uid("m"), category: "French Fries", name: "Plain Fries", small: 200, medium: null, large: null }
];
