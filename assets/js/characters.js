(function () {
  "use strict";

  var grid = document.querySelector(".characters-grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".character-card"));
  var status = document.getElementById("characters-status");
  var storageKey = "bk-favourite-character";

  function select(card, persist) {
    var name = card.getAttribute("data-character");

    cards.forEach(function (other) {
      var isSelected = other === card;
      other.classList.toggle("is-selected", isSelected);
      other.setAttribute("aria-pressed", isSelected ? "true" : "false");
      other.setAttribute(
        "aria-label",
        (isSelected ? "Selected: " : "Choose ") + other.getAttribute("data-character")
      );
    });

    if (status) {
      status.textContent = "Selected / " + name;
    }

    if (persist) {
      try {
        localStorage.setItem(storageKey, name);
      } catch (e) {
        /* Storage can be unavailable; the choice still works for this visit. */
      }
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      select(card, true);
    });
  });

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute("data-character") === saved) {
          select(cards[i], false);
          break;
        }
      }
    }
  } catch (e) {
    /* Ignore unavailable storage. */
  }
})();
