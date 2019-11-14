define(["focusManager", "layoutManager"], function (focusManager, layoutManager) {
    "use strict";

    /**
     * Previously selected element.
     */
    var activeElement;

    /**
     * Returns true if AutoFocuser is enabled.
     */
    function isEnabled() {
        return layoutManager.tv;
    };

    /**
     * Start AutoFocuser
     */
    function enable() {
        if (!isEnabled()) {
            return;
        }

        window.addEventListener("focusin", function (e) {
            activeElement = e.target;
        });

        console.log("AutoFocuser enabled");
    }

    /**
     * Set focus on a suitable element, taking into account the previously selected.
     */
    function autoFocus(container) {
        if (!isEnabled()) {
            return;
        }

        container = container || document.body;

        var candidates = [];

        if (activeElement) {
            // These elements are recreated
            if (activeElement.classList.contains("btnPreviousPage")) {
                candidates.push(container.querySelector(".btnPreviousPage"));
                candidates.push(container.querySelector(".btnNextPage"));
            } else if (activeElement.classList.contains("btnNextPage")) {
                candidates.push(container.querySelector(".btnNextPage"));
                candidates.push(container.querySelector(".btnPreviousPage"));
            } else if (activeElement.classList.contains("btnSelectView")) {
                candidates.push(container.querySelector(".btnSelectView"));
            }

            candidates.push(activeElement);
        }

        candidates = candidates.concat(Array.from(container.querySelectorAll(".btnResume")));
        candidates = candidates.concat(Array.from(container.querySelectorAll(".btnPlay")));

        var notFound = candidates.every(function (element) {
            if (focusManager.isCurrentlyFocusable(element)) {
                focusManager.focus(element);
                return false;
            }

            return true;
        });

        if (notFound) {
            // FIXME: Multiple itemsContainers
            var itemsContainer = container.querySelector(".itemsContainer");

            if (itemsContainer) {
                notFound = !focusManager.autoFocus(itemsContainer);
            }
        }

        if (notFound) {
            focusManager.autoFocus(container);
        }
    }

    return {
        isEnabled: isEnabled,
        enable: enable,
        autoFocus: autoFocus
    };
});
