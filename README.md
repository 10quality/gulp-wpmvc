# gulp-wpmvc

Predefined gulp tasks for [WordPress MVC](https://www.wordpress-mvc.com/) (WPMVC).

## Requirements
* node >= v0.12.0 <= 13
* npm >= v2.3.0

## Webpack

The package will detect if the project has a [Webpack](https://webpack.js.org/) configuration (file `webpack.config.js` at the root folder), if so, it will add the task `webpack`  and will include it in the build process.

## Troubleshooting

If experiencing issues with sass and other modules, use [nvm](https://github.com/creationix/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows) to downgrade your version of **NodeJS**.

## License

MIT license.

(c) 2020 [10 Quality](https://www.10quality.com/).