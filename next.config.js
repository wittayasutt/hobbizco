const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')

module.exports = withSass(
  withCSS({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      // Important: return the modified config
      config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

      if (!dev) {
        config.plugins.push(
          new OptimizeCssnanoPlugin({
            sourceMap: false,
            ignoreOrder: true,
            cssnanoOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            },
          }),
        )
      }
      return config
    },
  }),
)
