import React, { useEffect } from 'react';

const EmbedFix = ({ 
  title = "GlitchCandies:Creatures",
  description = "Demo launching soon!",
  image = "https://supernaturalcreatures.xyz/assets/Logobaner-DrybG2pY.png",
  url = "https://supernaturalcreatures.xyz/",
  type = "website",
  siteName = "GlitchCandies:Creatures",
  twitterUsername = "@glitchcandies"
}) => {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta tags
    const metaTags = {
      // Basic metadata
      'description': description,
      
      // Open Graph (Facebook, Discord, etc.)
      'og:type': type,
      'og:url': url,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:site_name': siteName,
      
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:url': url,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:site': twitterUsername,
      'twitter:creator': twitterUsername,
      
      // iOS Messages
      'apple-mobile-web-app-title': title,
      
      // Additional tags for better SEO and compatibility
      'theme-color': '#000000', // Adjust color as needed
      'msapplication-TileImage': image,
      'msapplication-TileColor': '#000000' // Adjust color as needed
    };

    // Add Facebook App ID if provided
    // if (appId) {
    //   metaTags['fb:app_id'] = appId;
    // }

    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[property="${name}"]`) || 
                 document.querySelector(`meta[name="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') || name.startsWith('fb:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Add canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

    // Cleanup function
    return () => {
      // Optionally remove meta tags when component unmounts
      // This might not be necessary for most use cases
    };
  }, [title, description, image, url, type, siteName, twitterUsername]);

  return null; // This component doesn't render anything
};

export default EmbedFix;