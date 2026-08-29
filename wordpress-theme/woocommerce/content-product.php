<?php
/**
 * WooCommerce Product Listing Card
 * Override of WooCommerce default product card
 *
 * @package LaxRee
 */

if ( ! defined( 'ABSPATH' ) ) exit;

global $product;
?>
<div class="product-card" style="margin-bottom: 24px;">
    <a href="<?php the_permalink(); ?>" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
        <!-- Image -->
        <div class="image">
            <?php if ( has_post_thumbnail() ) : ?>
                <?php the_post_thumbnail( 'laxree-product', array( 'alt' => get_the_title() ) ); ?>
            <?php else : ?>
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-ink-muted); font-size: 14px;">No Image</div>
            <?php endif; ?>
        </div>
        <!-- Body -->
        <div class="body">
            <h3><?php the_title(); ?></h3>
            <div class="price">
                <?php
                $sku = $product->get_sku();
                if ( $sku ) echo 'Model: ' . esc_html( $sku );
                ?>
            </div>
            <span style="margin-top: auto; padding-top: 16px; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-brass);">
                View Details
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
        </div>
    </a>
</div>
