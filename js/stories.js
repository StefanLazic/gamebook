/* Регистар прича.
 *
 * Свака прича се пријави са STORIES.register(story). Мотор (js/engine.js)
 * онда сам направи листу на насловном екрану.
 *
 * Story shape:
 *   { id, title, subtitle, emoji, blurb, tags: [..], cover, howtoId, legacySaveKey,
 *     statDefs: [{ key, icon, label, start, min, max }],
 *     guard: function (state, id) -> id | null,
 *     start, passages }
 */
var STORIES = (function () {
  'use strict';

  var list = [];

  function register(story) {
    list.push(story);
    return story;
  }

  function get(id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  return { list: list, register: register, get: get };
})();
