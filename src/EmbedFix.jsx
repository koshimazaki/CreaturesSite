import React, { useEffect } from 'react';

const EmbedFix = ({ 
  title = "GlitchCandies:Creatures",
  description = "Demo launching soon!",
  image = "https://supernaturalcreatures.xyz/assets/Logobaner-DrybG2pY.png",
  url = "https://supernaturalcreatures.xyz/",
  type = "website",
  siteName = "GlitchCandies:Creatures",
  twitterUsername = "@glitchcandies",
  themeColor = "#000000",
  // These props can be uncommented when you have the assets
  // appleIconUrl = "/apple-touch-icon.png",
  // favicon = "/favicon.ico",
  // manifestUrl = "/manifest.json"
}) => {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta tags
    const metaTags = {
      // Basic metadata
      'description': description,
      'author': 'Glitch NFT Studio',
      
      // Open Graph (Facebook, Discord, etc.)
      'og:type': type,
      'og:url': url,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:site_name': siteName,
      'og:locale': 'en_US',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': description,
      
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:url': url,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:site': twitterUsername,
      'twitter:creator': twitterUsername,
      
      // iOS/Apple specific
      'apple-mobile-web-app-title': title,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      
      // Microsoft/Windows
      'msapplication-TileImage': image,
      'msapplication-TileColor': themeColor,
      'msapplication-navbutton-color': themeColor,
      
      // Chrome, Firefox OS and Opera
      'theme-color': themeColor,
      
      // Discord specific
      'discord:title': title,
      'discord:description': description,
      'discord:image': image,
      
      // Telegram
      'telegram:title': title,
      'telegram:description': description,
      'telegram:image': image,
      
      // SEO verification (add your actual verification codes)
      // 'google-site-verification': 'your-google-verification-code',
      // 'yandex-verification': 'your-yandex-verification-code',
    };

    // Set meta tags
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

    // Comment out the entire link tags section until you have the assets
    /*
    const linkTags = {
      'canonical': url,
      'icon': favicon,
      'apple-touch-icon': appleIconUrl,
      'manifest': manifestUrl,
    };

    Object.entries(linkTags).forEach(([rel, href]) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    });
    */

    // Add preconnect for performance
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      // Add other domains you're connecting to
    ];

    preconnectDomains.forEach(domain => {
      let link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup is optional but could be implemented if needed
    };
  }, [
    title, 
    description, 
    image, 
    url, 
    type, 
    siteName, 
    twitterUsername, 
    themeColor,
    // Remove these from dependencies until you have the assets
    // appleIconUrl,
    // favicon,
    // manifestUrl
  ]);

  return null;
};

export default EmbedFix;
