export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/onboarding/', '/api/', '/pay/'],
    },
    sitemap: 'https://www.rooferledger.com/sitemap.xml',
  }
}
