import { Banner } from "fumadocs-ui/components/banner";
import { Callout } from "fumadocs-ui/components/callout";
// Import all the Fumadocs UI components we need
import { Card, Cards } from "fumadocs-ui/components/card";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
// Import icons from lucide-react
import { FileIcon, CpuIcon, NetworkIcon } from "lucide-react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mdx/mermaid";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Add Fumadocs UI components to make them available in MDX
    Card,
    Cards,
    Callout,
    Step,
    Steps,
    File,
    Folder,
    Files,
    Tab,
    Tabs,
    Banner,
    Accordion,
    Accordions,
    // Add Mermaid component for diagrams
    Mermaid,
    // Add icons to make them available in MDX
    FileIcon,
    CpuIcon,
    NetworkIcon,
    ...components,
  };
}

// export a `useMDXComponents()` that returns MDX components
export const useMDXComponents = getMDXComponents;
