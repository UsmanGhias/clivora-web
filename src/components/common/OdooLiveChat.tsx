"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Embeds Odoo Live Chat (Channel 3 - Clivora Support & Community Team)
 * Powered by community.clivora.io
 * Automatically opens / prompts after 5 seconds on page load.
 */
export function OdooLiveChat() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const livechatBtn = document.querySelector<HTMLElement>(
          ".o_livechat_button, .o-livechat-LivechatButton, button[class*='livechat'], div[class*='o_livechat']",
        );
        if (livechatBtn && !sessionStorage.getItem("clivora_chat_auto_prompted")) {
          livechatBtn.click();
          sessionStorage.setItem("clivora_chat_auto_prompted", "1");
        }
      } catch {
        // Continue silently if user already interacted
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        id="odoo-livechat-loader"
        src="https://community.clivora.io/im_livechat/loader/3"
        strategy="afterInteractive"
      />
      <Script
        id="odoo-livechat-assets"
        src="https://community.clivora.io/im_livechat/assets_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
