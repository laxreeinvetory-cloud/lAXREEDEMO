<?php
/**
 * Homepage Template — LaxRee Amenities
 * All sections: Hero, Categories, About, Spotlight, Clients, Presence, Certifications, CTA
 *
 * @package Laxree
 */

get_header();
?>

<!-- ═══════════════════════════════════════════════════════════════
     HERO
     ═══════════════════════════════════════════════════════════════ -->
<section class="hero section section-charcoal" id="home" style="padding-top: 96px;">
    <div class="container-laxree">
        <div class="hero-grid">
            <!-- Left: Content -->
            <div>
                <span class="eyebrow text-brass" style="font-size: 13px; letter-spacing: 0.2em;">Hotel Supplies Redefined</span>
                <h1 style="margin-top: 20px; font-size: clamp(2.75rem, 6vw, 5.25rem); line-height: 1.02; letter-spacing: -0.015em;">
                    Opening Doors To A <span class="text-brass-gradient">Whole New World</span> Of Hotel Supplies
                </h1>
                <p class="hero-subtitle">
                    Premium hotel &amp; resort amenities, furniture, linen, roofing
                    and lighting — manufactured and supplied pan-India by LaxRee,
                    India's largest hospitality exhibition centre.
                </p>
                <div class="hero-cta">
                    <a href="<?php echo esc_url( home_url( '/products' ) ); ?>" class="pill pill-brass">Explore Products →</a>
                    <a href="<?php echo esc_url( home_url( '/contact-us' ) ); ?>" class="pill pill-ghost-ivory">Get a Quotation</a>
                </div>
                <!-- Stats -->
                <div class="hero-stats glass-on-charcoal card-24">
                    <div>
                        <div class="hero-stat-value">1,347+</div>
                        <div class="hero-stat-label">Projects</div>
                    </div>
                    <div>
                        <div class="hero-stat-value">11+</div>
                        <div class="hero-stat-label">Years</div>
                    </div>
                    <div>
                        <div class="hero-stat-value">700+</div>
                        <div class="hero-stat-label">SKUs</div>
                    </div>
                    <div>
                        <div class="hero-stat-value">7+</div>
                        <div class="hero-stat-label">Certifications</div>
                    </div>
                </div>
            </div>
            <!-- Right: Image -->
            <div style="display: flex; align-items: center; justify-content: center;">
                <div class="hero-image-wrap">
                    <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero-room.png' ); ?>"
                         alt="LaxRee Premium Hotel Room" class="hero-image">
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     TRUST MARQUEE
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-emerald" style="padding: 20px 0;">
    <div class="marquee-wrap">
        <div class="marquee-track">
            <?php
            $certs = array( 'ISO 9001 Certified', 'ISO 14001 Certified', 'ISO 45001 Certified', 'CE Certified', 'RoHS Compliant', 'Pan-India Delivery', '700+ Product SKUs' );
            $doubled = array_merge( $certs, $certs );
            foreach ( $doubled as $cert ) :
            ?>
                <div class="marquee-item">
                    <span style="font-family: var(--font-mono); font-size: 13px; color: var(--color-brass); text-transform: uppercase; letter-spacing: 0.15em;"><?php echo esc_html( $cert ); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     CATEGORY BENTO GRID
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-ivory" id="categories">
    <div class="container-laxree">
        <div style="margin-bottom: 48px; max-width: 700px;">
            <span class="eyebrow text-ink-muted">Our Latest Offering</span>
            <h2 style="margin-top: 16px; font-size: clamp(2rem, 4vw, 3.25rem); color: var(--color-ink);">Eight Categories. One Standard.</h2>
            <p style="margin-top: 20px; color: var(--color-ink-muted); font-size: 15px;">From room amenities to dome structures — one supplier, one quality bar, one invoice.</p>
        </div>
        <div class="category-grid">
            <?php
            $categories = array(
                array( 'name' => 'Room Amenities', 'count' => '91 Products', 'image' => '/assets/images/cat-room.png', 'large' => true ),
                array( 'name' => 'Washroom Amenities', 'count' => '43 Products', 'image' => '/assets/images/cat-washroom.png' ),
                array( 'name' => 'Lobby Items', 'count' => '31 Products', 'image' => '/assets/images/cat-lobby.png' ),
                array( 'name' => 'Furniture', 'count' => '399 Products', 'image' => '/assets/images/cat-furniture.png' ),
                array( 'name' => 'Linen', 'count' => '2 Products', 'image' => '/assets/images/cat-linen.png', 'tall' => true ),
                array( 'name' => 'Bath Tub', 'count' => '22 Products', 'image' => '/assets/images/cat-bathtub.png' ),
                array( 'name' => 'Amenities Tray Set', 'count' => '1 Product', 'image' => '/assets/images/cat-tray.png' ),
                array( 'name' => 'Dome & Space POD', 'count' => '4 Products', 'image' => '/assets/images/cat-dome.png' ),
            );
            foreach ( $categories as $cat ) :
                $slug = sanitize_title( $cat['name'] );
            ?>
                <a href="<?php echo esc_url( home_url( '/products/' . $slug ) ); ?>"
                   class="category-card <?php echo $cat['large'] ? 'large' : ''; ?> <?php echo isset($cat['tall']) ? 'tall' : ''; ?>">
                    <img src="<?php echo esc_url( get_template_directory_uri() . $cat['image'] ); ?>"
                         alt="<?php echo esc_attr( $cat['name'] ); ?>"
                         loading="lazy">
                    <div class="overlay"></div>
                    <div class="content">
                        <h3><?php echo esc_html( $cat['name'] ); ?></h3>
                        <div class="count"><?php echo esc_html( $cat['count'] ); ?></div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     ABOUT US (Who We Are)
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-charcoal" id="about">
    <div class="container-laxree">
        <div class="hero-grid">
            <div>
                <span class="eyebrow text-brass">Who We Are</span>
                <h2 style="margin-top: 20px; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 500; line-height: 1.05;">Who We Are</h2>
                <p style="margin-top: 24px; color: var(--color-sand); font-size: 17px; line-height: 1.6; max-width: 520px;">
                    At LaxRee Amenities, we specialize in Premium Hotel &amp; Resort Amenities designed to enhance guest comfort and elevate hospitality standards. Trusted by leading hotels across India, we are committed to quality, innovation, and timely service.
                </p>
                <div style="margin-top: 32px; display: flex; flex-wrap: wrap; gap: 8px;">
                    <span class="glass-on-charcoal" style="border-radius: 999px; padding: 8px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--color-sand);">OEM Manufacturer</span>
                    <span class="glass-on-charcoal" style="border-radius: 999px; padding: 8px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--color-sand);">India's Largest Exhibition Centre</span>
                    <span class="glass-on-charcoal" style="border-radius: 999px; padding: 8px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--color-sand);">Pan-India Delivery</span>
                </div>
                <a href="<?php echo esc_url( home_url( '/about-us' ) ); ?>" class="pill pill-ghost-brass" style="margin-top: 40px;">Know More →</a>
            </div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/about-us.png' ); ?>"
                     alt="LaxRee Experience Center" style="border-radius: 24px; max-width: 100%; border: 2px solid rgba(198,161,91,0.2); box-shadow: 0 20px 60px rgba(198,161,91,0.1);">
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     CLIENTS & TESTIMONIALS
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-ivory" id="clients">
    <div class="container-laxree">
        <div style="text-align: center; margin-bottom: 48px;">
            <span class="eyebrow text-brass" style="font-size: 13px;">CLIENTS</span>
            <h2 style="margin-top: 12px; font-size: clamp(2rem, 4vw, 3.25rem); color: var(--color-ink);">Trusted by the Best in Hospitality</h2>
        </div>

        <!-- Client Logo Grid -->
        <div class="client-logo-grid">
            <?php
            $client_logos = get_posts( array(
                'post_type' => 'client_logo',
                'posts_per_page' => -1,
                'orderby' => 'menu_order',
                'order' => 'ASC',
            ) );

            if ( $client_logos ) :
                foreach ( $client_logos as $logo ) :
                    if ( has_post_thumbnail( $logo->ID ) ) :
            ?>
                        <div class="client-logo-card">
                            <img src="<?php echo esc_url( get_the_post_thumbnail_url( $logo->ID, 'full' ) ); ?>"
                                 alt="<?php echo esc_attr( $logo->post_title ); ?>">
                        </div>
                    <?php else : ?>
                        <div class="client-logo-card">
                            <span style="font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--color-ink-muted);">
                                <?php echo esc_html( $logo->post_title ); ?>
                            </span>
                        </div>
                    <?php endif; ?>
                <?php endforeach;
            else :
                // Default client names if no CPT entries
                $default_clients = array( 'Radisson', 'Holiday Inn', 'Fairmont', 'Taj', 'Club Mahindra', 'Ramada', 'The Fern Hotels & Resorts', 'Sayaji Hotels', 'Sunday Hotels', '7 Apple Hotels', 'Ananta Hotels', 'The Lords Inn', 'Swosti Group' );
                foreach ( $default_clients as $name ) :
                ?>
                    <div class="client-logo-card">
                        <span style="font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--color-ink-muted);"><?php echo esc_html( $name ); ?></span>
                    </div>
                <?php endforeach;
            endif;
            ?>
        </div>

        <!-- Testimonials -->
        <?php
        $testimonials = get_posts( array(
            'post_type' => 'testimonial',
            'posts_per_page' => 3,
        ) );

        if ( $testimonials ) :
        ?>
            <div style="margin-top: 48px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                <?php foreach ( $testimonials as $t ) :
                    $name = get_post_meta( $t->ID, '_testimonial_name', true ) ?: $t->post_title;
                    $role = get_post_meta( $t->ID, '_testimonial_role', true );
                    $hotel = get_post_meta( $t->ID, '_testimonial_hotel', true );
                ?>
                    <div style="background: #fff; border-radius: 20px; border: 1px solid rgba(26,23,18,0.08); padding: 32px; position: relative;">
                        <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                            <?php for ( $i = 0; $i < 5; $i++ ) : ?>
                                <span style="color: var(--color-brass);">★</span>
                            <?php endfor; ?>
                        </div>
                        <p style="font-style: italic; color: var(--color-ink); font-size: 15px; line-height: 1.6;">"<?php echo esc_html( $t->post_content ); ?>"</p>
                        <div class="hairline-brass" style="margin: 24px 0 16px;"></div>
                        <div>
                            <div style="font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--color-ink);"><?php echo esc_html( $name ); ?></div>
                            <div class="data-label" style="color: var(--color-ink-muted); margin-top: 4px;"><?php echo esc_html( $role ); ?></div>
                            <div class="data-label text-brass" style="margin-top: 2px;"><?php echo esc_html( $hotel ); ?></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     HOSPITALITY TRENDS (Blog)
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-ivory" id="blog" style="background: var(--color-ivory);">
    <div class="container-laxree">
        <div style="text-align: center; margin-bottom: 48px;">
            <span class="eyebrow text-brass">HOSPITALITY TRENDS</span>
            <h2 style="margin-top: 12px; font-size: clamp(2rem, 4vw, 3.25rem); color: var(--color-ink);">Insights &amp; Guides</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            <?php
            $blog_posts = get_posts( array( 'posts_per_page' => 3 ) );
            foreach ( $blog_posts as $post ) : setup_postdata( $post );
            ?>
                <a href="<?php the_permalink(); ?>" style="text-decoration: none; color: inherit;">
                    <div style="background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid rgba(26,23,18,0.08); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(198,161,91,0.1)';" onmouseout="this.style.transform=''; this.style.boxShadow='';">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div style="aspect-ratio: 16/9; overflow: hidden;">
                                <img src="<?php echo esc_url( get_the_post_thumbnail_url( $post, 'laxree-blog' ) ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%; height:100%; object-fit: cover;">
                            </div>
                        <?php endif; ?>
                        <div style="padding: 24px;">
                            <div class="data-label text-brass"><?php echo esc_html( get_the_category()[0]->name ?? 'Blog' ); ?></div>
                            <h3 style="margin-top: 8px; font-size: 18px; color: var(--color-ink);"><?php the_title(); ?></h3>
                            <p style="margin-top: 8px; font-size: 14px; color: var(--color-ink-muted);" class="line-clamp-2"><?php echo wp_trim_words( get_the_excerpt(), 20 ); ?></p>
                        </div>
                    </div>
                </a>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════════════════
     CTA BANNER
     ═══════════════════════════════════════════════════════════════ -->
<section class="section section-emerald" style="padding: 80px 0;">
    <div class="container-laxree text-center">
        <h2 style="font-size: clamp(2rem, 4.5vw, 3.25rem); color: var(--color-ivory); font-weight: 500;">Ready to elevate your Guest Experience?</h2>
        <p style="margin-top: 20px; color: rgba(247,243,234,0.8); font-size: 20px;">Get a custom quotation within 24 hours. No obligation.</p>
        <div style="margin-top: 40px; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
            <a href="<?php echo esc_url( home_url( '/contact-us' ) ); ?>" class="pill pill-brass">Get a Quotation →</a>
            <a href="tel:<?php echo esc_attr( preg_replace('/\s+/', '', laxree_phone() ) ); ?>" class="pill pill-ghost-ivory">Call <?php echo esc_html( laxree_phone() ); ?></a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
