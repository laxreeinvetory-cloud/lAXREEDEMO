<?php
/**
 * Single Blog Post Template
 *
 * @package Laxree
 */

get_header();
?>

<section class="section section-charcoal" style="padding-top: 140px;">
    <div class="container-laxree" style="max-width: 800px;">
        <?php while ( have_posts() ) : the_post(); ?>
            <!-- Breadcrumbs -->
            <div style="margin-bottom: 24px;">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="color: var(--color-sand); font-size: 13px;">Home</a>
                <span style="color: var(--color-sand); margin: 0 8px;">/</span>
                <a href="<?php echo esc_url( home_url( '/blog' ) ); ?>" style="color: var(--color-sand); font-size: 13px;">Blog</a>
                <span style="color: var(--color-sand); margin: 0 8px;">/</span>
                <span style="color: var(--color-brass); font-size: 13px;"><?php the_title(); ?></span>
            </div>

            <!-- Category + Title -->
            <?php
            $cats = get_the_category();
            if ( $cats ) :
            ?>
                <div class="eyebrow text-brass"><?php echo esc_html( $cats[0]->name ); ?></div>
            <?php endif; ?>

            <h1 style="margin-top: 12px; font-size: clamp(1.75rem, 3.5vw, 2.5rem); color: var(--color-ivory);"><?php the_title(); ?></h1>

            <!-- Meta -->
            <div style="margin-top: 16px; display: flex; align-items: center; gap: 16px; color: var(--color-sand); font-size: 13px;">
                <span>By <?php the_author(); ?></span>
                <span>·</span>
                <span><?php echo get_the_date(); ?></span>
                <span>·</span>
                <span><?php echo get_the_date( 'g:i a' ); ?> IST</span>
            </div>

            <!-- Featured Image -->
            <?php if ( has_post_thumbnail() ) : ?>
                <div style="margin-top: 32px; border-radius: 24px; overflow: hidden;">
                    <img src="<?php echo esc_url( get_the_post_thumbnail_url( get_the_ID(), 'laxree-blog' ) ); ?>" alt="<?php the_title_attribute(); ?>" style="width: 100%; height: auto;">
                </div>
            <?php endif; ?>

            <!-- Content -->
            <div style="margin-top: 40px; color: var(--color-sand); font-size: 16px; line-height: 1.8;">
                <?php the_content(); ?>
            </div>

            <!-- Tags -->
            <?php
            $tags = get_the_tags();
            if ( $tags ) :
            ?>
                <div style="margin-top: 40px; display: flex; flex-wrap: wrap; gap: 8px;">
                    <?php foreach ( $tags as $tag ) : ?>
                        <span class="glass-on-charcoal" style="border-radius: 999px; padding: 6px 14px; font-family: var(--font-mono); font-size: 11px; color: var(--color-brass);">#<?php echo esc_html( $tag->name ); ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <!-- Share -->
            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 16px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-sand); text-transform: uppercase;">Share:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode( get_permalink() ); ?>" target="_blank" style="color: var(--color-brass);">Facebook</a>
                <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode( get_permalink() ); ?>&text=<?php echo urlencode( get_the_title() ); ?>" target="_blank" style="color: var(--color-brass);">Twitter</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo urlencode( get_permalink() ); ?>" target="_blank" style="color: var(--color-brass);">LinkedIn</a>
            </div>

        <?php endwhile; ?>
    </div>
</section>

<?php get_footer(); ?>
