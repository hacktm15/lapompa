<?php
/**
 * Created by PhpStorm.
 * User: calinmarian
 * Date: 11/7/15
 * Time: 21:02
 */

namespace Drupal\benzinarie\Carburant;

use Drupal\user\PrivateTempStore;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\Entity\User;
use Drupal;

class TipCarburant {
  const BENZINA_REGULAR = 2;

  /**
   * @return Drupal\taxonomy\Entity\Term
   */
  static public function getTipCarburantCurent() {
    if ($tip_carburant = self::getUserCarburant()) {
      return $tip_carburant;
    }

    if ($tip_carburant = self::getTempStoreCarburant()) {
      return $tip_carburant;
    }

    return self::getDefaultTipCarburant();
  }

  /**
   * @return Drupal\taxonomy\Entity\Term
   */
  static private function getDefaultTipCarburant() {
    return Term::load(static::BENZINA_REGULAR);
  }

  /**
   * @return Drupal\taxonomy\Entity\Term|null
   */
  static private function getTempStoreCarburant() {
    $temp_store = \Drupal::getContainer()->get('user.private_tempstore')->get();
    $id = $temp_store->get('tip_carburant');
    if ($id) {
      return Term::load($id);
    }
  }

  /**
   * @return Drupal\taxonomy\Entity\Term|null
   */
  static private function getUserCarburant() {
    $user = Drupal::currentUser();
    $user = User::load($user->id());

    return $user->field_tip_carburant_utilizat->entity;
  }

  /**
   * @return static[]
   */
  static public function getTipuriCarburant() {
    $tip_carburant_ids = \Drupal::entityQuery('taxonomy_term')
      ->condition('vid', 'tip_carburant')
      ->execute();
    $tipuri_carburant = Term::loadMultiple($tip_carburant_ids);
    return $tipuri_carburant;
  }

}