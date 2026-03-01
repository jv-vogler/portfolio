/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'

import './custom.scss'
import { importMap } from './importMap.js'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'PayloadCMS Admin',
  description: 'Content Management System',
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
