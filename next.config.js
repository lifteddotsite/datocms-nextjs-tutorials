/** @type {import('next').NextConfig} */

const imageDomains = [];

if (process.env.CONTENTFUL_IMAGES_DOMAIN) imageDomains.push(process.env.CONTENTFUL_IMAGES_DOMAIN);
if (process.env.STRAPI_IMAGES_DOMAIN) imageDomains.push(process.env.STRAPI_IMAGES_DOMAIN);
if (process.env.DATOCMS_IMAGES_DOMAIN) imageDomains.push(process.env.DATOCMS_IMAGES_DOMAIN);

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: imageDomains,
  },
};

module.exports = nextConfig;
