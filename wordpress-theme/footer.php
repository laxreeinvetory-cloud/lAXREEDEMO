<?php
/**
 * Footer Template
 *
 * @package LaxRee
 */
?>
</main><!-- .site-main -->

<!-- ═══════════════════════════════════════════════════════════════
     FOOTER
     ═══════════════════════════════════════════════════════════════ -->
<footer class="site-footer">
    <div class="container-laxree">
        <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <span style="font-family: var(--font-display); font-size: 28px; font-weight: 600; color: var(--color-brass);">LAXREE</span>
                <?php endif; ?>
                <p><?php echo esc_html( laxree_address() ); ?></p>
                <div class="footer-social">
                    <a href="https://facebook.com/laxreeamenities" target="_blank" aria-label="Facebook">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                    <a href="https://x.com/laxreeamenities" target="_blank" aria-label="X">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.3 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                    <a href="https://youtube.com/@laxreeamenities" target="_blank" aria-label="YouTube">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </a>
                    <a href="https://linkedin.com/company/laxree-amenities" target="_blank" aria-label="LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                    </a>
                </div>
            </div>

            <!-- Company Links -->
            <div class="footer-col">
                <h3>Company</h3>
                <ul>
                    <li><a href="<?php echo esc_url( home_url( '/about-us' ) ); ?>">About Us</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/clients' ) ); ?>">Clients</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/dealers' ) ); ?>">Dealers</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/catalogue' ) ); ?>">Catalogue</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/career' ) ); ?>">Career</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/contact-us' ) ); ?>">Contact Us</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/blog' ) ); ?>">Blog</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/faq' ) ); ?>">FAQ</a></li>
                </ul>
            </div>

            <!-- Categories -->
            <div class="footer-col">
                <h3>Categories</h3>
                <ul>
                    <li><a href="<?php echo esc_url( home_url( '/products/room-amenities' ) ); ?>">Room Amenities</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/washroom-amenities' ) ); ?>">Washroom Amenities</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/lobby-items' ) ); ?>">Lobby Items</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/furniture' ) ); ?>">Furniture</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/linen' ) ); ?>">Linen</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/bath-tub' ) ); ?>">Bath Tub</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/products/dome-space-pod' ) ); ?>">Dome &amp; Space POD</a></li>
                </ul>
            </div>

            <!-- Contact -->
            <div class="footer-col">
                <h3>Contact</h3>
                <ul>
                    <li><a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', laxree_phone() ) ); ?>"><?php echo esc_html( laxree_phone() ); ?></a></li>
                    <li><a href="https://wa.me/<?php echo esc_attr( laxree_whatsapp() ); ?>" target="_blank">WhatsApp Us</a></li>
                    <li><a href="mailto:<?php echo esc_attr( laxree_email() ); ?>"><?php echo esc_html( laxree_email() ); ?></a></li>
                    <li><a href="mailto:hr@laxree.com">hr@laxree.com</a></li>
                </ul>
                <div style="margin-top: 16px; font-family: var(--font-mono); font-size: 10px; color: var(--color-sand);">
                    ISO 9001 • ISO 14001 • ISO 45001 • CE • RoHS
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date( 'Y' ); ?> LaxRee Amenities — All Rights Reserved. Hotel Supplies Redefined.</p>
        </div>
    </div>
</footer>

<!-- ═══════════════════════════════════════════════════════════════
     FLOATING BUTTONS
     ═══════════════════════════════════════════════════════════════ -->

<!-- WhatsApp Float -->
<a href="https://wa.me/<?php echo esc_attr( laxree_whatsapp() ); ?>" class="whatsapp-float" target="_blank" aria-label="Chat on WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.982 11.982 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.943-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
</a>

<!-- Mobile Sticky Bar -->
<div class="mobile-sticky-bar">
    <a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', laxree_phone() ) ); ?>">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Call Now
    </a>
    <a href="https://wa.me/<?php echo esc_attr( laxree_whatsapp() ); ?>" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l4.93-1.38C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
        WhatsApp
    </a>
</div>

<?php wp_footer(); ?>
</body>
</html>
