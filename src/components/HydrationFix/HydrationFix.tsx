"use client";

import { useEffect } from 'react';

export default function HydrationFix() {
    useEffect(() => {
        // Clean up extension-added attributes after hydration
        const cleanExtensionAttributes = () => {
            // Remove common extension attributes
            const attributesToRemove = [
                'data-new-gr-c-s-check-loaded',
                'data-gr-ext-installed',
                'data-grammarly-shadow-root',
                'data-gramm'
            ];

            attributesToRemove.forEach(attr => {
                if (document.body.hasAttribute(attr)) {
                    document.body.removeAttribute(attr);
                }
            });

            // Also remove any Grammarly-added elements
            const grammarlyElements = document.querySelectorAll('[data-grammarly], [grammarly-shadow-root]');
            grammarlyElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        };

        // Run after a short delay to ensure hydration is complete
        const timer = setTimeout(cleanExtensionAttributes, 100);

        // Optional: MutationObserver to catch any future additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const attrName = mutation.attributeName;
                    if (attrName && (attrName.includes('grammarly') ||
                        attrName.includes('gr-') ||
                        attrName === 'data-new-gr-c-s-check-loaded')) {
                        document.body.removeAttribute(attrName);
                    }
                }

                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element &&
                            (node.hasAttribute('data-grammarly') ||
                                node.hasAttribute('grammarly-shadow-root'))) {
                            node.remove();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    return null;
}