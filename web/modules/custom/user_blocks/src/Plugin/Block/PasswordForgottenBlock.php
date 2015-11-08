<?php

/**
 * @file
 * Contains \Drupal\user_blocks\Plugin\Block\PasswordForgottenBlock.
 */

namespace Drupal\user_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'PasswordForgottenBlock' block.
 *
 * @Block(
 *  id = "password_forgotten_block",
 *  admin_label = @Translation("Password forgotten block"),
 * )
 */
class PasswordForgottenBlock extends BlockBase {


  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['password_forgotten_block'] = \Drupal::getContainer()->get('form_builder')->getForm('Drupal\user\Form\UserPasswordForm');

    return $build;
  }

}
