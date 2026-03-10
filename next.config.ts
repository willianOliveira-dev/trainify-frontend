import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.ufs.sh',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/static/**',
            },
            {
                protocol: 'https',
                hostname: 'sua-api.seudominio.com',
                pathname: '/static/**',
            },
        ],
        dangerouslyAllowSVG: false,
        unoptimized: true,
    },
};

export default nextConfig;
