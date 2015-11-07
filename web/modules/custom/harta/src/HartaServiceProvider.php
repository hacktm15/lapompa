<?php
/**
 * Created by PhpStorm.
 * User: calinmarian
 * Date: 11/7/15
 * Time: 19:35
 */

namespace Drupal\harta;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Modifies the language manager service.
 */
class HartaServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    // Overrides path.alias_manager class to show frontpage for 404 pages.
    $definition = $container->getDefinition('path.alias_manager');
    $definition->setClass('Drupal\harta\Path\AliasManagerNo404');
  }
}
?>