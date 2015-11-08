<?php

/**
 * @file
 * Contains \Drupal\benzinarie\Plugin\Block\VizualizareEditareBenzinarieBlock.
 */

namespace Drupal\benzinarie\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'VizualizareEditareBenzinarieBlock' block.
 *
 * @Block(
 *  id = "vizualizare_editare_benzinarie_block",
 *  admin_label = @Translation("Vizualizare editare benzinarie block"),
 * )
 */
class VizualizareEditareBenzinarieBlock extends BlockBase {


  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['vizualizare_editare_benzinarie_block']['#markup'] = 'Implement VizualizareEditareBenzinarieBlock.';

    return $build;
  }

}
