import type { NextConfig } from 'next'

// Next.js 16 can generate AI-agent instruction files at dev-server startup.
// This learning repository maintains its own documentation, so avoid generated files.
const nextConfig: NextConfig = {
  agentRules: false,
}

export default nextConfig
