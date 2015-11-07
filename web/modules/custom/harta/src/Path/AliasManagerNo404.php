<?php
/**
 * Created by PhpStorm.
 * User: calinmarian
 * Date: 11/7/15
 * Time: 19:37
 */

namespace Drupal\harta\Path;

use Drupal\Core\Path\AliasManager;
use Drupal\Core\Language\LanguageInterface;

class AliasManagerNo404 extends AliasManager {

  /**
   * {@inheritdoc}
   */
  public function getPathByAlias($alias, $langcode = NULL) {
    // If no language is explicitly specified we default to the current URL
    // language. If we used a language different from the one conveyed by the
    // requested URL, we might end up being unable to check if there is a path
    // alias matching the URL path.
    $langcode = $langcode ?: $this->languageManager->getCurrentLanguage(LanguageInterface::TYPE_URL)->getId();

    // If we already know that there are no paths for this alias simply return.
    if (empty($alias) || !empty($this->noPath[$langcode][$alias])) {
      return \Drupal::config('system.site')->get('page.front');
    }

    // Look for the alias within the cached map.
    if (isset($this->lookupMap[$langcode]) && ($path = array_search($alias, $this->lookupMap[$langcode]))) {
      return $path;
    }

    // Look for path in storage.
    if ($path = $this->storage->lookupPathSource($alias, $langcode)) {
      $this->lookupMap[$langcode][$path] = $alias;
      return $path;
    }


    // We can't record anything into $this->lookupMap because we didn't find any
    // paths for this alias. Thus cache to $this->noPath.
    $this->noPath[$langcode][$alias] = TRUE;

    return $alias;
  }
}