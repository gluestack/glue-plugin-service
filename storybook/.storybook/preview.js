export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    // inlineStories: false,
  },
  options: {
    storySort: {
      order: [
        "Service Node Plugin Docs",
        [
          "Getting Started",
          "Goals",
          "Requirements",
          "How to Install",
          "How it Works",
          "CLI Reference",
        ],
      ],
    },
  },
};
