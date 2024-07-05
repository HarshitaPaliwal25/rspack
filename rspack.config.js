const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const rspack = require('@rspack/core');
const process = require('process/browser');

const isProduction = process.env.NODE_ENV === 'production';

  
module.exports = {
  
  mode: isProduction ? 'production' : 'development',
  entry: './src/app/page.tsx',
  context: __dirname,
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Include .tsx for TypeScript support
    alias: {
      '@': path.resolve(__dirname, './'), // Adjust based on your project structure
      // Add more aliases as needed for better module resolution
    //   '@components': path.resolve(__dirname, 'components'),
    //   '@hoickouimain': path.resolve(__dirname, 'node_modules/@hoickouimain'),
    },
   
     
   
  },
  output: {
    uniqueName: 'user',
  },
  externals: {
    // Ignore Node.js built-in modules
    util: 'commonjs util',
    fs: 'commonjs fs',
    stream: 'commonjs stream',
    zlib: 'commonjs zlib',
  },
  stats:{
      children:true
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // Match both .js, .jsx, .ts, .tsx files
        include: path.resolve(__dirname, './'), // Adjust based on your project structure
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.tsx?$/, // Add loader configuration for TypeScript files
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader', // Use ts-loader for TypeScript files
        },
       
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[hash][ext][query]',
        },
      },
    
    ],
    parser: {
        'css/auto': {
          namedExports: false,
          esModule:true,
        },
        css: {
          namedExports: true,
        },
        'css/module': {
          namedExports: true,
        },
      },
  },
        
  optimization: {
    minimize: false, // Disabling minification because it takes too long on CI
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   excludeChunks: ['user'],
    //   // template: path.resolve(__dirname, 'public/index.html'),
    // }),
    // new ReactRefreshPlugin({
    //     // Enable React Refresh for React components
    //     overrideCreateElement: true,
    //   }),
      new rspack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      }),
    // new rspack.container.ModuleFederationPlugin({
    //   name: 'user',
    //   exposes: {
    //     './profile': './pages/user/profile.tsx',
    //     './teams': './pages/user/teams.tsx',
    //     './communication': './pages/user/communication.tsx',
    //     // './userconfig': './pages/user/userconfig.tsx',
    //     './adminGeneral': './pages/admin/general.tsx',
    //   },
    // //  shared:["@hoicko/alpha"],
    // // shared:{
    // //     '@hoicko/alpha': {
    // //         singleton: true,
    // //         eager: true,
    // //         requiredVersion: 'auto',
    // //       },
    // //     },
   
    //   shared: {
    //     react: {
    //         singleton: true,
    //         eager: true, // Optionally set to eager to ensure it's loaded upfront
    //         requiredVersion: '*', // Adjust based on your React version
    //       },
    //       'react-dom': {
    //         singleton: true,
    //         eager: true, // Optionally set to eager to ensure it's loaded upfront
    //         requiredVersion: '*', // Adjust based on your React version
    //       },
    //       '@hoicko/alpha': {
    //                 singleton: true,
    //                 eager: true,
    //                 requiredVersion: '*',
    //               },
    //   },
    // }),
    !isProduction && new ReactRefreshPlugin(),
  ].filter(Boolean), // Filter out undefined plugins in production
};

