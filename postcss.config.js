module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-cssnext": {
      features: {
        customProperties: {
          variables: {
            colorRed: "#c33",
            colorLightGrey: "#ebeef0",
          },
        },
        customMedia: {
          extensions: {
            maxS: "(max-width: 30em)",
            minS: "(min-width: 30.01em)",
            maxM: "(max-width: 50em)",
            minM: "(min-width: 50.01em)",
            maxL: "(max-width: 65em)",
            minL: "(min-width: 65.01em)",
            maxXL: "(max-width: 80em)",
            minXL: "(min-width: 80.01em)",
          },
        },
      },
    },
  },
};
