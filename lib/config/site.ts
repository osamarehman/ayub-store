export const siteConfig = {
  name: "Bin Ayub",
  description: "Quality products for every need",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+923060525347",

  // Navigation
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Products",
      href: "/products",
    },
    {
      title: "Categories",
      href: "/products",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],

  // Shipping
  shipping: {
    localCities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
    defaultCost: 200, // PKR
    freeShippingThreshold: 5000, // PKR
  },

  // Social Links
  social: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '')}`,
    instagram: "#",
    facebook: "#",
  },
};

export type SiteConfig = typeof siteConfig;
