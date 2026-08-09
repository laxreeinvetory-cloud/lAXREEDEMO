<?php
/**
 * Page Template
 *
 * @package Laxree
 */

get_header();
?>

<section class="section section-charcoal" style="padding-top: 140px;">
    <div class="container-laxree">
        <?php while ( have_posts() ) : the_post(); ?>
            <h1 style="font-size: clamp(2rem, 4vw, 3.25rem); color: var(--color-ivory);"><?php the_title(); ?></h1>
            <div style="margin-top: 32px; color: var(--color-sand); line-height: 1.7;">
                <?php the_content(); ?>
            </div>
        <?php endwhile; ?>
    </div>
</section>

<?php get_footer(); ?>
