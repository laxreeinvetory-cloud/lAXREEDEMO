# LaxRee Amenities WordPress Theme

Complete WordPress theme that replicates the LaxRee Amenities Next.js website with exact charcoal + brass design.

## Installation

### Step 1: Upload Theme
```
1. WordPress Admin → Appearance → Themes → Add New → Upload Theme
2. Upload laxree-amenities.zip (this folder zipped)
3. Activate
```

### Step 2: Install Required Plugins
```
WordPress Admin → Plugins → Add New:

Required:
- WooCommerce (for products + cart)
- Contact Form 7 (for forms)

Recommended:
- Yoast SEO (for SEO)
- Smush (for image compression)
- WP Rocket (for speed/caching)
```

### Step 3: Create Pages
```
WordPress Admin → Pages → Add New:

1. Home (set as static homepage: Settings → Reading)
2. About Us
3. Products
4. Clients
5. Catalogue
6. Dealers
7. Experience Center
8. Contact Us
9. Career
10. FAQ
```

### Step 4: Set Up Navigation
```
WordPress Admin → Appearance → Menus:

Create "Primary Menu":
- Home, About Us, Products, Clients, Catalogue, Dealers, Experience Center, Contact Us
- Set as: Primary Menu
```

### Step 5: Upload Logo
```
WordPress Admin → Appearance → Customize → Site Identity:
- Upload logo (laxree-logo.png)
- Set site icon (favicon)
```

### Step 6: Configure Contact Details
```
WordPress Admin → Appearance → Customize → Contact Details:
- Phone: +91 92516 83662
- WhatsApp: 919251683662
- Email: contactus@laxree.com
- Address: Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001
```

### Step 7: Import Products (WooCommerce)
```
1. Upload all product images to wp-content/uploads/2026/01/
2. WordPress Admin → Products → Import
3. Upload products.csv (included in this package)
4. Map columns
5. Run import
```

### Step 8: Add Custom Content
```
Admin panel menu items:
- Experience Centers → Add each center (Gurugram, Ajmer, Jaipur)
- Team Members → Add each member (Samarth, Reema, Bavika)
- Testimonials → Add client testimonials
- Case Studies → Add project case studies
- Client Logos → Upload hotel logos with images
- Leads → View form submissions
```

### Step 9: Configure WooCommerce
```
WordPress Admin → WooCommerce → Settings:

1. Currency: Indian Rupee (₹)
2. Disable online payment (quotation-based)
3. Products → Display: Categories + Products
4. Set product images
```

### Step 10: Set Permalinks
```
WordPress Admin → Settings → Permalinks:
- Select: "Post name"
- Custom structure: /%postname%/
- Save
```

## Customization

### Change Colors
```
Appearance → Customize → Additional CSS:
Edit the :root CSS variables in style.css
```

### Change Fonts
```
functions.php → laxree_scripts():
Update Google Fonts URL
```

### Add Blog Posts
```
Posts → Add New:
- Title, Content, Featured Image
- Set Category (Sustainability, Design, etc.)
```

### Manage Products
```
Products → Add New:
- Title, Description, Image
- Set Product Category
- Add Specifications as custom fields
```

## File Structure

```
laxree-amenities/
├── style.css              (Theme CSS + design system)
├── functions.php           (Theme setup, CPTs, AJAX, WooCommerce)
├── header.php              (Navbar + logo + navigation)
├── footer.php              (Footer + WhatsApp + mobile bar)
├── front-page.php          (Homepage with all sections)
├── page.php                (Generic page template)
├── index.php               (Blog listing)
├── single.php              (Blog post detail)
├── README.md               (This file)
├── assets/
│   ├── css/
│   ├── js/
│   │   └── main.js         (Sticky header, mobile menu, forms)
│   └── images/
│       ├── hero-room.png   (Hero image)
│       ├── about-us.png    (About section image)
│       └── cat-*.png       (Category images)
├── inc/
├── template-parts/
└── woocommerce/
```

## Custom Post Types

| Type | Purpose |
|---|---|
| `experience_center` | Experience centers (Gurugram, Ajmer, Jaipur) |
| `team_member` | Leadership team |
| `testimonial` | Client testimonials |
| `case_study` | Project case studies |
| `client_logo` | Hotel client logos |
| `exhibition` | Exhibition gallery images |
| `lead` | Form submissions |

## Support

For customization or issues:
- Email: contactus@laxree.com
- Phone: +91 92516 83662

## Version

1.0.0 — Initial release
