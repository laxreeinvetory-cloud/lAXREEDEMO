<?php
/**
 * Header Template
 *
 * @package LaxRee
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- ═══════════════════════════════════════════════════════════════
     HEADER / NAVBAR
     ═══════════════════════════════════════════════════════════════ -->
<header class="site-header" id="siteHeader">
    <div class="header-inner">
        <!-- Logo -->
        <div class="site-logo">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <span style="font-family: var(--font-display); font-size: 24px; font-weight: 600; color: var(--color-brass);">LAXREE</span>
                </a>
            <?php endif; ?>
        </div>

        <!-- Navigation -->
        <nav class="main-navigation" id="mainNav">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => '',
                'fallback_cb' => function() {
                    echo '<ul>';
                    $pages = get_pages( array( 'sort_column' => 'menu_order' ) );
                    foreach ( $pages as $page ) {
                        echo '<li><a href="' . get_permalink( $page->ID ) . '">' . $page->post_title . '</a></li>';
                    }
                    echo '</ul>';
                },
            ) );
            ?>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="cart-link" aria-label="Cart">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <span class="cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                </a>
            <?php endif; ?>

            <a href="<?php echo esc_url( home_url( '/contact-us' ) ); ?>" class="pill pill-brass" style="font-size: 14px; padding: 10px 24px;">
                Enquire Now
            </a>

            <button class="menu-toggle" id="menuToggle" aria-label="Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
        </div>
    </div>
</header>

<!-- Main content -->
<main class="site-main">
