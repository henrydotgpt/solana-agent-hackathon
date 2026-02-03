import { NextRequest, NextResponse } from "next/server";
import { getStorefront } from "@/lib/store";

/**
 * Embeddable payment widget endpoint
 * Returns a JavaScript snippet that renders a Paygent pay button on any website
 * Usage: <script src="https://paygent-app.vercel.app/api/widget/SLUG"></script>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const storefront = getStorefront(slug);

  if (!storefront) {
    return new NextResponse(
      `console.error("[Paygent] Storefront not found: ${slug}");`,
      {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://paygent-app.vercel.app";

  const widgetScript = `
(function() {
  'use strict';
  
  var SLUG = ${JSON.stringify(slug)};
  var BASE_URL = ${JSON.stringify(baseUrl)};
  var storeName = ${JSON.stringify(storefront.businessName)};
  var accentColor = ${JSON.stringify(storefront.theme.accentColor)};
  var productCount = ${storefront.products.length};
  
  // Find all Paygent embed targets
  var targets = document.querySelectorAll('[data-paygent], .paygent-button');
  
  // If no targets, create a floating button
  if (targets.length === 0) {
    var container = document.createElement('div');
    container.id = 'paygent-widget';
    document.body.appendChild(container);
    targets = [container];
  }
  
  // Inject styles
  var style = document.createElement('style');
  style.textContent = \`
    .paygent-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, \${accentColor}, #9945FF);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 12px \${accentColor}40;
      text-decoration: none;
    }
    .paygent-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px \${accentColor}60;
    }
    .paygent-btn:active {
      transform: translateY(0);
    }
    .paygent-btn svg {
      width: 18px;
      height: 18px;
    }
    .paygent-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .paygent-modal-overlay.active {
      opacity: 1;
    }
    .paygent-modal {
      background: #0c0c10;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      width: 90vw;
      max-width: 480px;
      height: 80vh;
      max-height: 700px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transform: scale(0.95) translateY(10px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .paygent-modal-overlay.active .paygent-modal {
      transform: scale(1) translateY(0);
    }
    .paygent-modal iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .paygent-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.5);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      z-index: 1;
      transition: background 0.2s;
    }
    .paygent-modal-close:hover {
      background: rgba(255,255,255,0.1);
    }
    .paygent-powered {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .paygent-powered a {
      color: \${accentColor};
      text-decoration: none;
    }
  \`;
  document.head.appendChild(style);
  
  // Solana logo SVG
  var solanaIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M5.25 16.5h12.38a.56.56 0 0 0 .4-.17l1.72-1.72a.28.28 0 0 0-.2-.48H7.17a.56.56 0 0 0-.4.17L5.05 16.02a.28.28 0 0 0 .2.48Zm0-5.25h12.38a.56.56 0 0 1 .4.17l1.72 1.72a.28.28 0 0 1-.2.48H7.17a.56.56 0 0 1-.4-.17L5.05 11.73a.28.28 0 0 1 .2-.48Zm1.92-3.75h12.38a.28.28 0 0 0 .2-.48L18.03 5.3a.56.56 0 0 0-.4-.17H5.25a.28.28 0 0 0-.2.48l1.72 1.72a.56.56 0 0 0 .4.17Z" fill="currentColor"/></svg>';
  
  // Create modal (reusable)
  var overlay = null;
  
  function openModal() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'paygent-modal-overlay';
      overlay.innerHTML = \`
        <div style="position:relative">
          <button class="paygent-modal-close" aria-label="Close">&times;</button>
          <div class="paygent-modal">
            <iframe src="\${BASE_URL}/pay/\${SLUG}?embed=1" allow="clipboard-write"></iframe>
          </div>
        </div>
      \`;
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('paygent-modal-close')) {
          closeModal();
        }
      });
      document.body.appendChild(overlay);
    }
    requestAnimationFrame(function() {
      overlay.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(function() {
        document.body.style.overflow = '';
      }, 200);
    }
  }
  
  // Render buttons
  targets.forEach(function(target) {
    var buttonText = target.getAttribute('data-paygent-text') || 'Pay with Solana';
    var btn = document.createElement('button');
    btn.className = 'paygent-btn';
    btn.innerHTML = solanaIcon + ' ' + buttonText;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
    
    var wrapper = document.createElement('div');
    wrapper.appendChild(btn);
    
    var powered = document.createElement('div');
    powered.className = 'paygent-powered';
    powered.innerHTML = 'Powered by <a href="' + BASE_URL + '" target="_blank">Paygent</a>';
    wrapper.appendChild(powered);
    
    if (target.id === 'paygent-widget') {
      // Floating position
      wrapper.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99998;';
    }
    
    target.replaceWith(wrapper);
  });
  
  // Listen for close message from iframe
  window.addEventListener('message', function(e) {
    if (e.data === 'paygent:close') closeModal();
    if (e.data && e.data.type === 'paygent:payment-complete') {
      // Dispatch custom event for merchant's site
      window.dispatchEvent(new CustomEvent('paygent:payment', { detail: e.data }));
    }
  });
})();
`;

  return new NextResponse(widgetScript.trim(), {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
