<?php
/**
 * Blog Archive Template
 *
 * @package Laxree
 */

get_header();
?>

<section class="section section-charcoal" style="padding-top: 140px;">
    <div class="container-laxree">
        <h1 style="font-size: clamp(2rem, 4vw, 3.25rem); color: var(--color-ivory);">
            <?php
            if ( is_home() ) {
                echo 'Hospitality Trends';
            } elseif ( is_category() ) {
                single_cat_title();
            } else {
                echo 'Blog';
            }
            ?>
        </h1>
        <p style="margin-top: 16px; color: var(--color-sand); font-size: 16px;">Insights, buying guides, and industry trends from LaxRee Amenities.</p>

        <div style="margin-top: 48px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <?php while ( have_posts() ) : the_post(); ?>
                <a href="<?php the_permalink(); ?>" style="text-decoration: none; color: inherit;">
                    <div class="glass-on-charcoal card-24" style="overflow: hidden; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(198,161,91,0.4)';" onmouseout="this.style.transform=''; this.style.borderColor='';">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div style="aspect-ratio: 16/9; overflow: hidden;">
                                <img src="<?php echo esc_url( get_the_post_thumbnail_url( get_the_ID(), 'laxree-blog' ) ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%; height:100%; object-fit: cover;">
                            </div>
                        <?php endif; ?>
                        <div style="padding: 24px;">
                            <div class="data-label text-brass"><?php echo esc_html( get_the_category()[0]->name ?? 'Blog' ); ?> · <?php echo get_the_date( 'M Y' ); ?></div>
                            <h3 style="margin-top: 8px; font-size: 18px; color: var(--color-ivory);"><?php the_title(); ?></h3>
                            <p style="margin-top: 8px; font-size: 14px; color: var(--color-sand);" class="line-clamp-2"><?php echo wp_trim_words( get_the_excerpt(), 20 ); ?></p>
                            <span style="margin-top: 16px; display: inline-block; font-family: var(--font-mono); font-size: 11px; color: var(--color-brass); text-transform: uppercase;">Read More →</span>
                        </div>
                    </div>
                </a>
            <?php endwhile; ?>
        </div>

        <!-- Pagination -->
        <div style="margin-top: 48px; text-align: center;">
            <?php
            echo paginate_links( array(
                'prev_text' => '← Previous',
                'next_text' => 'Next →',
            ) );
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
