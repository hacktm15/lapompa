<?php

/**
 * @file
 * Contains \Drupal\harta\Plugin\Block\HartaBlock.
 */

namespace Drupal\harta\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityManager;

/**
 * Provides a 'HartaBlock' block.
 *
 * @Block(
 *  id = "harta_block",
 *  admin_label = @Translation("Harta benzinariilor"),
 * )
 */
class HartaBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Drupal\Core\Entity\Query\QueryFactory definition.
   *
   * @var Drupal\Core\Entity\Query\QueryFactory
   */
  protected $entity_query;

  /**
   * Drupal\Core\Entity\EntityManager definition.
   *
   * @var Drupal\Core\Entity\EntityManager
   */
  protected $entity_manager;
  /**
   * Construct.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param string $plugin_definition
   *   The plugin implementation definition.
   */
  public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        QueryFactory $entity_query, 
	EntityManager $entity_manager
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entity_query = $entity_query;
    $this->entity_manager = $entity_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity.query'),
      $container->get('entity.manager')
    );
  }



  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['harta_block']['listing']['#markup'] = '<div id="wrapper-listing-benzinarii"></div>';
    $build['harta_block']['harta']['#markup'] = '<div id="harta"></div>';
    $build['harta_block']['harta']['#attached']['library'][] = 'harta/harta_lapompa';

    return $build;
  }

}
