import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="ElizaOS Logo"
        >
          <rect width="24" height="24" fill="#2563eb" className="dark:fill-blue-400" />
          <g transform="translate(2, 2) scale(0.65)">
            <path
              d="M12.3617 2.0737L8.25813 2.0737V4.1474L20.6196 4.1474V6.17052L26.8004 6.17052V4.1474L24.7232 4.1474V2.0737L18.5425 2.0737V0L12.3617 0V2.0737Z"
              fill="white"
            />
            <path
              d="M6.18099 8.24422L4.10386 8.24422L4.10386 18.5116H2.07738L2.07738 28.8295H0.000244141L0.000244141 32.9263H2.07738L2.07738 35H6.18099V32.9263H8.25813V30.9032H10.2846L10.2846 20.5853H8.25813L8.25813 14.4147H12.3617V16.4884L14.4287 16.4783L16.4907 16.4632L16.5059 14.3996L16.516 12.341L20.6196 12.341L20.6196 8.24422L12.3617 8.24422V6.17052L6.18099 6.17052V8.24422Z"
              fill="white"
            />
            <path
              d="M24.7232 14.4147H26.8004V12.341L28.8775 12.341V16.4884H30.904V12.341H28.8775L28.8775 10.3179L24.7232 10.3179L24.7232 14.4147Z"
              fill="white"
            />
            <path
              d="M24.7232 30.9032H22.6968V28.8295H18.5425L18.5425 35H20.6196L20.6196 32.9263L21.6481 32.9364L22.6714 32.9516L22.6866 33.9733L22.6968 35H26.8004L26.8004 26.7558H24.7232V30.9032Z"
              fill="white"
            />
          </g>
        </svg>
        elizaOS
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
