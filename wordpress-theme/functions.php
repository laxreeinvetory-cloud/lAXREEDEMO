<?php
/**
 * LaxRee Amenities Theme Functions
 *
 * @package LaxRee
 * @since 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// THEME SETUP
// ═══════════════════════════════════════════════════════════════

if ( ! function_exists( 'laxree_setup' ) ) {
    function laxree_setup() {
        // Theme supports
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'custom-logo', array(
            'height'      => 40,
            'width'       => 150,
            'flex-height' => true,
            'flex-width'  => true,
        ) );
        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
        add_theme_support( 'woocommerce' );
        add_theme_support( 'wc-product-gallery-zoom' );
        add_theme_support( 'wc-product-gallery-lightbox' );
        add_theme_support( 'wc-product-gallery-slider' );
        add_theme_support( 'align-wide' );
        add_theme_support( 'responsive-embeds' );

        // Image sizes
        add_image_size( 'laxree-hero', 1920, 1080, true );
        add_image_size( 'laxree-category', 800, 600, true );
        add_image_size( 'laxree-product', 800, 600, true );
        add_image_size( 'laxree-blog', 1200, 630, true );
        add_image_size( 'laxree-team', 400, 400, true );

        // Register menus
        register_nav_menus( array(
            'primary' => __( 'Primary Menu', 'laxree' ),
            'footer'  => __( 'Footer Menu', 'laxree' ),
            'mobile'  => __( 'Mobile Menu', 'laxree' ),
        ) );
    }
}
add_action( 'after_setup_theme', 'laxree_setup' );

// ═══════════════════════════════════════════════════════════════
// ENQUEUE STYLES & SCRIPTS
// ═══════════════════════════════════════════════════════════════

function laxree_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'laxree-fonts',
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
        array(),
        null
    );

    // Theme stylesheet
    wp_enqueue_style( 'laxree-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Theme JS
    wp_enqueue_script( 'laxree-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true );

    // Lucide icons
    wp_enqueue_script( 'lucide', 'https://unpkg.com/lucide@latest', array(), null, true );

    // AJAX nonce
    wp_localize_script( 'laxree-main', 'laxree_ajax', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => wp_create_nonce( 'laxree_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'laxree_scripts' );

// ═══════════════════════════════════════════════════════════════
// WOOCOMMERCE SUPPORT
// ═══════════════════════════════════════════════════════════════

// Remove WooCommerce default wrapper
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

// Add custom wrapper
add_action( 'woocommerce_before_main_content', 'laxree_woo_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content', 'laxree_woo_wrapper_end', 10 );

function laxree_woo_wrapper_start() {
    echo '<section class="section section-ivory py-16 md:py-24"><div class="container-laxree">';
}

function laxree_woo_wrapper_end() {
    echo '</div></section>';
}

// Products per page
add_filter( 'loop_shop_per_page', function() { return 12; }, 20 );

// Products per row
add_filter( 'loop_shop_columns', function() { return 4; }, 999 );

// Remove default WooCommerce breadcrumb (we use our own)
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

// Hide "Add to Cart" on shop pages (quotation-based)
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );

// Replace price with "Request Quote"
add_filter( 'woocommerce_get_price_html', function( $price, $product ) {
    if ( ! is_product() ) {
        return '<span class="data-label text-brass">Request Quote</span>';
    }
    return $price;
}, 10, 2 );

// ═══════════════════════════════════════════════════════════════
// CUSTOM POST TYPES
// ═══════════════════════════════════════════════════════════════

function laxree_register_cpts() {

    // Experience Centers
    register_post_type( 'experience_center', array(
        'labels' => array(
            'name' => 'Experience Centers',
            'singular_name' => 'Experience Center',
            'add_new_item' => 'Add New Center',
            'edit_item' => 'Edit Center',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-building',
        'supports' => array( 'title', 'editor', 'thumbnail' ),
        'show_in_rest' => true,
    ) );

    // Team Members
    register_post_type( 'team_member', array(
        'labels' => array(
            'name' => 'Team Members',
            'singular_name' => 'Team Member',
            'add_new_item' => 'Add New Member',
            'edit_item' => 'Edit Member',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-groups',
        'supports' => array( 'title', 'editor', 'thumbnail' ),
        'show_in_rest' => true,
    ) );

    // Testimonials
    register_post_type( 'testimonial', array(
        'labels' => array(
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new_item' => 'Add New Testimonial',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => array( 'title', 'editor' ),
        'show_in_rest' => true,
    ) );

    // Case Studies
    register_post_type( 'case_study', array(
        'labels' => array(
            'name' => 'Case Studies',
            'singular_name' => 'Case Study',
            'add_new_item' => 'Add New Case Study',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array( 'title', 'editor', 'thumbnail' ),
        'show_in_rest' => true,
    ) );

    // Client Logos
    register_post_type( 'client_logo', array(
        'labels' => array(
            'name' => 'Client Logos',
            'singular_name' => 'Client Logo',
            'add_new_item' => 'Add New Client',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-businessperson',
        'supports' => array( 'title', 'thumbnail', 'page-attributes' ),
        'show_in_rest' => true,
    ) );

    // Product Categories as hierarchical taxonomy (already via WooCommerce)
    // Exhibition Gallery
    register_post_type( 'exhibition', array(
        'labels' => array(
            'name' => 'Exhibitions',
            'singular_name' => 'Exhibition',
            'add_new_item' => 'Add New Exhibition',
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-camera',
        'supports' => array( 'title', 'thumbnail' ),
        'show_in_rest' => true,
    ) );
}
add_action( 'init', 'laxree_register_cpts' );

// ═══════════════════════════════════════════════════════════════
// CUSTOM FIELDS (using native WP, no ACF needed for basic)
// ═══════════════════════════════════════════════════════════════

// Meta boxes for Experience Centers
function laxree_add_meta_boxes() {
    add_meta_box( 'center_details', 'Center Details', 'laxree_center_meta_cb', 'experience_center', 'normal', 'high' );
    add_meta_box( 'team_details', 'Member Details', 'laxree_team_meta_cb', 'team_member', 'normal', 'high' );
    add_meta_box( 'testimonial_details', 'Testimonial Details', 'laxree_testimonial_meta_cb', 'testimonial', 'normal', 'high' );
    add_meta_box( 'case_study_details', 'Case Study Details', 'laxree_case_study_meta_cb', 'case_study', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'laxree_add_meta_boxes' );

function laxree_center_meta_cb( $post ) {
    $address = get_post_meta( $post->ID, '_center_address', true );
    $tagline = get_post_meta( $post->ID, '_center_tagline', true );
    $stats = get_post_meta( $post->ID, '_center_stats', true );
    wp_nonce_field( 'laxree_meta', 'laxree_meta_nonce' );
    ?>
    <p>
        <label><strong>Tagline</strong></label><br>
        <input type="text" name="center_tagline" value="<?php echo esc_attr( $tagline ); ?>" style="width:100%">
    </p>
    <p>
        <label><strong>Address</strong></label><br>
        <textarea name="center_address" style="width:100%" rows="3"><?php echo esc_textarea( $address ); ?></textarea>
    </p>
    <p>
        <label><strong>Stats (one per line: Label|Value)</strong></label><br>
        <textarea name="center_stats" style="width:100%" rows="5"><?php echo esc_textarea( $stats ); ?></textarea>
    </p>
    <?php
}

function laxree_team_meta_cb( $post ) {
    $role = get_post_meta( $post->ID, '_team_role', true );
    $bio = get_post_meta( $post->ID, '_team_bio', true );
    wp_nonce_field( 'laxree_meta', 'laxree_meta_nonce' );
    ?>
    <p>
        <label><strong>Role</strong></label><br>
        <input type="text" name="team_role" value="<?php echo esc_attr( $role ); ?>" style="width:100%">
    </p>
    <p>
        <label><strong>Bio</strong></label><br>
        <textarea name="team_bio" style="width:100%" rows="4"><?php echo esc_textarea( $io ); ?></textarea>
    </p>
    <?php
}

function laxree_testimonial_meta_cb( $post ) {
    $name = get_post_meta( $post->ID, '_testimonial_name', true );
    $role = get_post_meta( $post->ID, '_testimonial_role', true );
    $hotel = get_post_meta( $post->ID, '_testimonial_hotel', true );
    wp_nonce_field( 'laxree_meta', 'laxree_meta_nonce' );
    ?>
    <p><label><strong>Person Name</strong></label><br>
        <input type="text" name="testimonial_name" value="<?php echo esc_attr( $name ); ?>" style="width:100%"></p>
    <p><label><strong>Role</strong></label><br>
        <input type="text" name="testimonial_role" value="<?php echo esc_attr( $role ); ?>" style="width:100%"></p>
    <p><label><strong>Hotel</strong></label><br>
        <input type="text" name="testimonial_hotel" value="<?php echo esc_attr( $hotel ); ?>" style="width:100%"></p>
    <p><em>Quote goes in the main content editor above.</em></p>
    <?php
}

function laxree_case_study_meta_cb( $post ) {
    $hotel = get_post_meta( $post->ID, '_cs_hotel', true );
    $location = get_post_meta( $post->ID, '_cs_location', true );
    $project = get_post_meta( $post->ID, '_cs_project', true );
    $scope = get_post_meta( $post->ID, '_cs_scope', true );
    $outcome = get_post_meta( $post->ID, '_cs_outcome', true );
    $metric = get_post_meta( $post->ID, '_cs_metric', true );
    $metric_label = get_post_meta( $post->ID, '_cs_metric_label', true );
    wp_nonce_field( 'laxree_meta', 'laxree_meta_nonce' );
    ?>
    <p><label><strong>Hotel Name</strong></label><br>
        <input type="text" name="cs_hotel" value="<?php echo esc_attr( $hotel ); ?>" style="width:100%"></p>
    <p><label><strong>Location</strong></label><br>
        <input type="text" name="cs_location" value="<?php echo esc_attr( $location ); ?>" style="width:100%"></p>
    <p><label><strong>Project Title</strong></label><br>
        <input type="text" name="cs_project" value="<?php echo esc_attr( $project ); ?>" style="width:100%"></p>
    <p><label><strong>Scope</strong></label><br>
        <textarea name="cs_scope" style="width:100%" rows="3"><?php echo esc_textarea( $scope ); ?></textarea></p>
    <p><label><strong>Outcome</strong></label><br>
        <textarea name="cs_outcome" style="width:100%" rows="3"><?php echo esc_textarea( $outcome ); ?></textarea></p>
    <p><label><strong>Metric Value (e.g. 142)</strong></label><br>
        <input type="text" name="cs_metric" value="<?php echo esc_attr( $metric ); ?>" style="width:50%"></p>
    <p><label><strong>Metric Label (e.g. Rooms delivered)</strong></label><br>
        <input type="text" name="cs_metric_label" value="<?php echo esc_attr( $metric_label ); ?>" style="width:100%"></p>
    <?php
}

function laxree_save_meta( $post_id ) {
    if ( ! isset( $_POST['laxree_meta_nonce'] ) || ! wp_verify_nonce( $_POST['laxree_meta_nonce'], 'laxree_meta' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $fields = array(
        'center_tagline', 'center_address', 'center_stats',
        'team_role', 'team_bio',
        'testimonial_name', 'testimonial_role', 'testimonial_hotel',
        'cs_hotel', 'cs_location', 'cs_project', 'cs_scope', 'cs_outcome', 'cs_metric', 'cs_metric_label',
    );

    foreach ( $fields as $field ) {
        if ( isset( $_POST[$field] ) ) {
            $meta_key = '_' . str_replace( array( 'center_', 'team_', 'testimonial_', 'cs_' ), array( '_center_', '_team_', '_testimonial_', '_cs_' ), $field );
            update_post_meta( $post_id, $meta_key, sanitize_text_field( $_POST[$field] ) );
        }
    }
}
add_action( 'save_post', 'laxree_save_meta' );

// ═══════════════════════════════════════════════════════════════
// AJAX LEAD FORM
// ═══════════════════════════════════════════════════════════════

function laxree_handle_lead() {
    check_ajax_referer( 'laxree_nonce', 'nonce' );

    $name = sanitize_text_field( $_POST['name'] ?? '' );
    $email = sanitize_email( $_POST['email'] ?? '' );
    $phone = sanitize_text_field( $_POST['phone'] ?? '' );
    $category = sanitize_text_field( $_POST['category'] ?? '' );
    $message = sanitize_textarea_field( $_POST['message'] ?? '' );
    $source = sanitize_text_field( $_POST['source'] ?? 'contact-page' );

    if ( empty( $name ) || empty( $phone ) ) {
        wp_send_json_error( array( 'message' => 'Name and phone are required' ) );
    }

    // Save as lead (custom post type or email)
    $lead_id = wp_insert_post( array(
        'post_type' => 'lead',
        'post_title' => $name . ' — ' . $phone,
        'post_status' => 'publish',
        'post_content' => $message,
        'meta_input' => array(
            '_lead_name' => $name,
            '_lead_email' => $email,
            '_lead_phone' => $phone,
            '_lead_category' => $category,
            '_lead_source' => $source,
        ),
    ) );

    // Email notification
    $to = get_option( 'admin_email' );
    $subject = 'New Lead from ' . $name;
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nCategory: $category\nSource: $source\n\nMessage:\n$message";
    wp_mail( $to, $subject, $body );

    wp_send_json_success( array( 'message' => 'Thank you! We will contact you soon.' ) );
}
add_action( 'wp_ajax_laxree_lead', 'laxree_handle_lead' );
add_action( 'wp_ajax_nopriv_laxree_lead', 'laxree_handle_lead' );

// Register Leads CPT
function laxree_register_leads_cpt() {
    register_post_type( 'lead', array(
        'labels' => array(
            'name' => 'Leads',
            'singular_name' => 'Lead',
        ),
        'public' => false,
        'show_ui' => true,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => array( 'title', 'editor' ),
        'menu_position' => 25,
    ) );
}
add_action( 'init', 'laxree_register_leads_cpt' );

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Site phone number (editable in Customizer)
function laxree_phone() { return get_theme_mod( 'laxree_phone', '+91 92516 83662' ); }
function laxree_whatsapp() { return get_theme_mod( 'laxree_whatsapp', '919251683662' ); }
function laxree_email() { return get_theme_mod( 'laxree_email', 'contactus@laxree.com' ); }
function laxree_address() { return get_theme_mod( 'laxree_address', 'Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001' ); }

// Customizer settings
function laxree_customize_register( $wp_customize ) {
    $wp_customize->add_section( 'laxree_contact', array(
        'title' => 'Contact Details',
        'priority' => 30,
    ) );

    $fields = array(
        'laxree_phone' => 'Phone Number',
        'laxree_whatsapp' => 'WhatsApp Number',
        'laxree_email' => 'Email Address',
        'laxree_address' => 'Address',
    );

    foreach ( $fields as $key => $label ) {
        $wp_customize->add_setting( $key, array( 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp_customize->add_control( $key, array(
            'label' => $label,
            'section' => 'laxree_contact',
            'type' => 'text',
        ) );
    }
}
add_action( 'customize_register', 'laxree_customize_register' );

// Excerpt length
add_filter( 'excerpt_length', function() { return 20; } );

// Excerpt more
add_filter( 'excerpt_more', function() { return '...'; } );

// Remove emoji scripts (performance)
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// Disable WordPress version in head
remove_action( 'wp_head', 'wp_generator' );

// Body classes
function laxree_body_class( $classes ) {
    if ( is_front_page() ) $classes[] = 'is-home';
    if ( is_singular( 'product' ) ) $classes[] = 'single-product-page';
    return $classes;
}
add_filter( 'body_class', 'laxree_body_class' );
