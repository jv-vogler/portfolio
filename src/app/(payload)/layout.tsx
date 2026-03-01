/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from "next";

import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";

import "./custom.scss";
import { importMap } from "./importMap.js";

type Args = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "PayloadCMS Admin",
  description: "Content Management System",
};

const serverFunction = async function (args: unknown) {
  "use server";
  return handleServerFunctions({
    ...JSON.parse(args as string),
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
