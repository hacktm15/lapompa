<?php

/**
 * @file
 * Contains \Drupal\user_blocks\Plugin\Block\UserRegisterBlock.
 */

namespace Drupal\user_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'UserRegisterBlock' block.
 *
 * @Block(
 *  id = "user_register_block",
 *  admin_label = @Translation("User register block"),
 * )
 */
class UserRegisterBlock extends BlockBase {


  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['user_register_block']['#markup'] = 'Implement UserRegisterBlock.';

    return $build;
  }

}
