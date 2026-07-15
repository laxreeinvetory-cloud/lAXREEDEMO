import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LaxRee Amenities — Hotel Supplies Redefined",
    short_name: "LaxRee",
    description:
      "Premium hotel & resort amenities, furniture, linen, roofing and lighting — manufactured and supplied pan-India by LaxRee, Ajmer's largest hospitality exhibition centre.",
    start_url: "/",
    display: "standalone",
    background_color: "#12100D",
    theme_color: "#C6A15B",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
