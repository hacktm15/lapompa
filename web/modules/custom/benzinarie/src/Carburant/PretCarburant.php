<?php
/**
 * Created by PhpStorm.
 * User: calinmarian
 * Date: 11/7/15
 * Time: 21:38
 */

namespace Drupal\benzinarie\Carburant;


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
    $preturi_ids = \Drupal::entityQuery('node')
      ->condition('type', 'pret')
      ->condition('field_benzinarie.target_id', $benzinarie->id())
      ->condition('field_tip_carburant.target_id', $tip_carburant->id())
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->execute();

    if (count($preturi_ids)) {
      $pret_id = array_shift($preturi_ids);
      $pret = Node::load($pret_id);
      return $pret;
    }
  }
}