<?php
/**
 * Plugin Name:       Breadcrumbs
 * Description:       Breadcrumb navigation
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           1.0
 * Author:            Simon Flöter
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       breadcrumbs
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_breadcrumbs_block_init() {
	register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'render_breadcrumbs',
  ) );
}
add_action( 'init', 'create_block_breadcrumbs_block_init' );


function render_breadcrumbs() {
    $post_ancestors = get_post_ancestors( get_the_ID() );
    $html = '<nav class="breadcrumbs">';
    $html .= '<a href="' . home_url() . '">Home</a>';
    if ( $post_ancestors ) {
        $post_ancestors = array_reverse( $post_ancestors );
        foreach ( $post_ancestors as $ancestor ) {
            $html .= '<a href="' . get_permalink( $ancestor ) . '">' . get_the_title( $ancestor ) . '</a>';
        }
    }
    $html .= '<span>' . get_the_title() . '</span>';
    $html .= '</nav>';
    return $html;
}