<?php

/**
 * @file
 * Contains \Drupal\harta\Controller\ListingBenzinarii.
 */

namespace Drupal\harta\Controller;

use Drupal\benzinarie\Carburant\PretCarburant;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ListingBenzinarii.
 *
 * @package Drupal\harta\Controller
 */
class ListingBenzinarii extends ControllerBase {

  /**
   * Drupal\Core\Entity\EntityTypeManager definition.
   *
   * @var Drupal\Core\Entity\EntityTypeManager
   */
  protected $entity_type_manager;

  /**
   * Drupal\Core\Entity\Query\QueryFactory definition.
   *
   * @var Drupal\Core\Entity\Query\QueryFactory
   */
  protected $entity_query;

  /**
   * Drupal\Core\Render\RendererInterface definition.
   *
   * @var Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManager $entity_type_manager, QueryFactory $entity_query, RendererInterface $renderer) {
    $this->entity_type_manager = $entity_type_manager;
    $this->entity_query = $entity_query;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('entity.query'),
      $container->get('renderer')
    );
  }

  /**
   * Listing.
   *
   * @return string
   *   Return Hello string.
   */
  public function listing($lat_ne, $lon_ne, $lat_sw, $lon_sw) {
    $response = new JsonResponse();
    $data = $this->queryBenzinarii($lat_ne, $lon_ne, $lat_sw, $lon_sw);
    $response->setData($data);
    return $response;
  }

  private function queryBenzinarii($lat_ne, $lon_ne, $lat_sw, $lon_sw) {
    $data = new \stdClass();
    $data->pins = [];
    $data->listing = '';

    $query = $this->entity_query->get('node')
      ->condition('field_coordonate.lat', (float) $lat_ne, '<')
      ->condition('field_coordonate.lon', (float) $lon_ne, '<')
      ->condition('field_coordonate.lat', (float) $lat_sw, '>')
      ->condition('field_coordonate.lon', (float) $lon_sw, '>');

    $ids = $query->execute();

    if (!count($ids)) {
      return $data;
    }

    $entities = $this->entity_type_manager->getStorage('node')->loadMultiple($ids);

    foreach ($entities as $entity) {
      $pin = new \stdClass();
      $pin->lat = $entity->field_coordonate->lat;
      $pin->lon = $entity->field_coordonate->lon;
      $pin->pret = PretCarburant::getPretCarburantCurent($entity)->field_valoare->value;
      $pin->id = $entity->id();
      if ($pin->pret) {
        $entity->pret = $pin->pret;
        $data->pins[$pin->id] = $pin;
        $render_entities [] = $entity;
      }
    }

    if (!count($render_entities)) {
      return $data;
    }

    uasort($render_entities, function($a, $b) {
      if ($a->pret == $b->pret) {
        return 0;
      }
      else if ($a->pret > $b->pret) {
        return -1;
      }
      else {
        return 1;
      }
    });

    $render = $this->entity_type_manager->getViewBuilder('node')->viewMultiple($render_entities, 'small_teaser');
    $data->listing = '<div class="listing-benzinarii">' . $this->renderer->render($render) . '</div>';

    return $data;
  }

}
