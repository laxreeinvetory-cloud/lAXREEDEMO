export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
};

export type BlogPostFull = BlogPost & {
  author: string;
  authorRole: string;
  content: { heading?: string; paragraphs: string[] }[];
};

export type CatalogueProduct = {
  model: string;
  name: string;
  category: string;
  image: string;
  specs: { label: string; value: string }[];
  description: string;
};

export type CatalogueCategory = {
  slug: string;
  name: string;
  products: CatalogueProduct[];
};
