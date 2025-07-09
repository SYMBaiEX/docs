import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// Import all the Fumadocs UI components we need
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { File, Folder, Files } from 'fumadocs-ui/components/files';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Banner } from 'fumadocs-ui/components/banner';

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
    ...components,
  };
}
