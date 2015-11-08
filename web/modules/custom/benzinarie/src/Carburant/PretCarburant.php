<?php
/**
 * Created by PhpStorm.
 * User: calinmarian
 * Date: 11/7/15
 * Time: 21:38
 */

namespace Drupal\benzinarie\Carburant;


use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class PretCarburant {

  /**
   * @param \Drupal\node\Entity\Node $benzinarie
   * @return null|static
   */
  static public function getPretCarburantCurent(Node $benzinarie) {
    $tip_carburant_curent_controller = new TipCarburant();
    $tip_carburant_curent = $tip_carburant_curent_controller->getTipCarburantCurent();
    return self::getPret($benzinarie, $tip_carburant_curent);
  }

  /**
   * @param \Drupal\node\Entity\Node $benzinarie
   * @param \Drupal\taxonomy\Entity\Term $tip_carburant
   * @return null|static
   */
  static public function getPret(Node $benzinarie, Term $tip_carburant) {
    $cid = self::getCid($benzinarie, $tip_carburant);

    $pret = NULL;
    if ($cache = \Drupal::cache()->get($cid)) {
      $pret = $cache->data;
    }
    elseif ($pret_entity = self::getPretEntity($benzinarie, $tip_carburant)) {
      $pret = $pret_entity->field_valoare->value;
    }

    \Drupal::cache()->set($cid, $pret);
    return $pret;
  }

  static public function getPretEntity(Node $benzinarie, Term $tip_carburant) {
    $preturi_ids = \Drupal::entityQuery('node')
      ->condition('type', 'pret')
      ->condition('field_benzinarie.target_id', $benzinarie->id())
      ->condition('field_tip_carburant.target_id', $tip_carburant->id())
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->execute();

    if (count($preturi_ids)) {
      $pret_id = array_shift($preturi_ids);
      return Node::load($pret_id);
    }

  }

  static public function getCid(Node $benzinarie, Term $tip_carburant) {
    return 'benzinarie:' . $benzinarie->id() . ':carburant:' . $tip_carburant->id();
  }

  static public function clearCachePret(Node $benzinarie, Term $tip_carburant) {
    $cid = self::getCid($benzinarie, $tip_carburant);
    \Drupal::cache()->delete($cid);
  }
}