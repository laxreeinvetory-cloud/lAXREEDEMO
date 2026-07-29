import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Center — LaxRee Amenities",
  description:
    "Visit India's largest hospitality supply experience centers in Ajmer, Jaipur, and Gurugram. See, touch, and experience our full product range in person.",
};

export default function ExperienceCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
