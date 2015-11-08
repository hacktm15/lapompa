<?php

/**
 * @file
 * Contains \Drupal\harta\Tests\ListingBenzinarii.
 */

namespace Drupal\harta\Tests;

use Drupal\simpletest\WebTestBase;
use Drupal\Core\Entity\EntityManager;
use Drupal\Core\Entity\Query\QueryFactory;

/**
 * Provides automated tests for the harta module.
 */
class ListingBenzinariiTest extends WebTestBase {

  /**
   * Drupal\Core\Entity\EntityManager definition.
   *
   * @var Drupal\Core\Entity\EntityManager
   */
  protected $entity_manager;

  /**
   * Drupal\Core\Entity\Query\QueryFactory definition.
   *
   * @var Drupal\Core\Entity\Query\QueryFactory
   */
  protected $entity_query;
  /**
   * {@inheritdoc}
   */
  public static function getInfo() {
    return array(
      'name' => "harta ListingBenzinarii's controller functionality",
      'description' => 'Test Unit for module harta and controller ListingBenzinarii.',
      'group' => 'Other',
    );
  }

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
  }

  /**
   * Tests harta functionality.
   */
  public function testListingBenzinarii() {
    // Check that the basic functions of module harta.
    $this->assertEquals(TRUE, TRUE, 'Test Unit Generated via App Console.');
  }

}
