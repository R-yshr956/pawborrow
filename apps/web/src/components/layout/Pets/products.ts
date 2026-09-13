export interface Product {
  id: number;
  name: string;
  productCategory: "Pet Food" | "Bed & Comfort" | "Pet Toys";
  animals: string[];
  image: string;
}

export const products: Product[] = [
  // ===== PET FOOD (14) =====
  { id: 1, name: "Dry Kibble (Adult Maintenance)", productCategory: "Pet Food", animals: ["Dog"], image: "/images/products/food1.png" },
  { id: 2, name: "Wet Canned Food (High-protein loaf/gravy)", productCategory: "Pet Food", animals: ["Dog"], image: "/images/products/food2.png" },
  { id: 3, name: "Puppy Starter Blend", productCategory: "Pet Food", animals: ["Dog"], image: "/images/products/food3.png" },
  { id: 4, name: "Training Treats / Dental Chews", productCategory: "Pet Food", animals: ["Dog"], image: "/images/products/food4.png" },
  { id: 5, name: "Dry Indoor Formula", productCategory: "Pet Food", animals: ["Cat"], image: "/images/products/food5.png" },
  { id: 6, name: "Wet Gravy Pouch / Pate", productCategory: "Pet Food", animals: ["Cat"], image: "/images/products/food6.png" },
  { id: 7, name: "Kitten Formula", productCategory: "Pet Food", animals: ["Cat"], image: "/images/products/food7.png" },
  { id: 8, name: "Hairball / Sensitive Stomach Treats", productCategory: "Pet Food", animals: ["Cat"], image: "/images/products/food8.png" },
  { id: 9, name: "Timothy Hay Bale (Primary forage)", productCategory: "Pet Food", animals: ["Rabbit"], image: "/images/products/food9.png" },
  { id: 10, name: "Adult Rabbit Pellets", productCategory: "Pet Food", animals: ["Rabbit"], image: "/images/products/food10.png" },
  { id: 11, name: "Dried Herb & Botanical Treat Mix", productCategory: "Pet Food", animals: ["Rabbit"], image: "/images/products/food11.png" },
  { id: 12, name: "High-Fiber Guinea Pig Pellets (Stabilized Vitamin C)", productCategory: "Pet Food", animals: ["Guinea Pig"], image: "/images/products/food12.png" },
  { id: 13, name: "Timothy / Orchard Grass Hay", productCategory: "Pet Food", animals: ["Guinea Pig"], image: "/images/products/food13.png" },
  { id: 14, name: "Dried Veggie & Vitamin C Chew Drops", productCategory: "Pet Food", animals: ["Guinea Pig"], image: "/images/products/food14.png" },

  // ===== BED & COMFORT (10) =====
  { id: 15, name: "Small Donut Cuddle Bed", productCategory: "Bed & Comfort", animals: ["Cat", "Dog"], image: "/images/products/bed1.png" },
  { id: 16, name: "Medium Orthopedic Bolster Bed", productCategory: "Bed & Comfort", animals: ["Dog"], image: "/images/products/bed2.png" },
  { id: 17, name: "Large Waterproof Pet Pad", productCategory: "Bed & Comfort", animals: ["Dog"], image: "/images/products/bed3.png" },
  { id: 18, name: "Cozy Plush Fleece Blanket", productCategory: "Bed & Comfort", animals: ["Cat", "Dog", "Rabbit", "Guinea Pig"], image: "/images/products/bed4.png" },
  { id: 19, name: "Fleece Hideout Tunnel", productCategory: "Bed & Comfort", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/bed5.png" },
  { id: 20, name: "Wooden Cabin / Nest Box", productCategory: "Bed & Comfort", animals: ["Guinea Pig"], image: "/images/products/bed6.png" },
  { id: 21, name: "Soft-Sided Travel Carrier", productCategory: "Bed & Comfort", animals: ["Cat", "Dog"], image: "/images/products/bed7.png" },
  { id: 22, name: "Hard Plastic Crate", productCategory: "Bed & Comfort", animals: ["Dog"], image: "/images/products/bed8.png" },
  { id: 23, name: "Portable Playpen / Enclosure", productCategory: "Bed & Comfort", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/bed9.png" },
  { id: 24, name: "Calming Car Seat Harness/Booster", productCategory: "Bed & Comfort", animals: ["Dog", "Cat"], image: "/images/products/bed10.png" },

  // ===== PET TOYS (13) =====
  { id: 25, name: "Heavy-Duty Rubber Chew / Kong (Fillable)", productCategory: "Pet Toys", animals: ["Dog"], image: "/images/products/toy1.png" },
  { id: 26, name: "Braided Rope Tug Toy", productCategory: "Pet Toys", animals: ["Dog"], image: "/images/products/toy2.png" },
  { id: 27, name: "Squeaky Plush Toy", productCategory: "Pet Toys", animals: ["Dog"], image: "/images/products/toy3.png" },
  { id: 28, name: "Tennis Ball Launcher Pack", productCategory: "Pet Toys", animals: ["Dog"], image: "/images/products/toy4.png" },
  { id: 29, name: "Interactive Treat Puzzle Board", productCategory: "Pet Toys", animals: ["Dog"], image: "/images/products/toy5.png" },
  { id: 30, name: "Feather Teaser Wand", productCategory: "Pet Toys", animals: ["Cat"], image: "/images/products/toy6.png" },
  { id: 31, name: "Catnip Mice / Kicker Pillows (3-pack)", productCategory: "Pet Toys", animals: ["Cat"], image: "/images/products/toy7.png" },
  { id: 32, name: "Sisal Scratching Post with Ball Track", productCategory: "Pet Toys", animals: ["Cat"], image: "/images/products/toy8.png" },
  { id: 33, name: "Laser Pointer / Automatic Rolling Ball", productCategory: "Pet Toys", animals: ["Cat"], image: "/images/products/toy9.png" },
  { id: 34, name: "Willow Wood Chew Balls (Pack of 3)", productCategory: "Pet Toys", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/toy10.png" },
  { id: 35, name: "Apple Wood Stick Bundle", productCategory: "Pet Toys", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/toy11.png" },
  { id: 36, name: "Snuffle Foraging Mat", productCategory: "Pet Toys", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/toy12.png" },
  { id: 37, name: "Timothy Hay Roll-and-Tumble Ball", productCategory: "Pet Toys", animals: ["Rabbit", "Guinea Pig"], image: "/images/products/toy13.png" },
];

export const PRODUCT_CATEGORIES = ["Pet Food", "Bed & Comfort", "Pet Toys"];
export const ANIMAL_FILTERS = ["Cat", "Dog", "Guinea Pig", "Rabbit"];