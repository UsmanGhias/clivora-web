export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NWRF8EF0J3";

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            var savedConsent = null;
            try { savedConsent = localStorage.getItem('clivora_cookie_consent'); } catch (e) {}
            var consentState = savedConsent === 'all' ? 'granted' : 'denied';
            gtag('consent', 'default', {
              'analytics_storage': consentState,
              'ad_storage': consentState,
              'ad_user_data': consentState,
              'ad_personalization': consentState,
              'wait_for_update': 500
            });
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
