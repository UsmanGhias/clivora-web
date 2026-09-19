interface GoogleAdSenseProps {
  publisherId?: string;
}

export function GoogleAdSense({
  publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-6149132910438736",
}: GoogleAdSenseProps) {
  if (!publisherId) {
    return null;
  }

  return (
    <>
      <meta name="google-adsense-account" content={publisherId} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
