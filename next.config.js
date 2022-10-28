/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_API_BACKEND: process.env.REACT_APP_API_BACKEND,
    REACT_APP_API_SOCKET_IO: process.env.REACT_APP_API_SOCKET_IO,
  },
  images: {
    domains: ['drive.google.com' , 'lh3.googleusercontent.com'],
  },

}


module.exports = nextConfig