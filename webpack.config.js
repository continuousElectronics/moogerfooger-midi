const 
    path   = require("path"),
    Uglify = require("uglifyjs-webpack-plugin"),
    env    = process.env.NODE_ENV;

const webpackObj = {
    watch: (env === "development") ? true : false,
    target: "electron",
    entry: {
        main: ["babel-polyfill", "./src/index"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    devServer: {
        contentBase: "./build"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader"
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: "babel-loader"
                    }
                }
            }
        ]
    }
};

if (env === "production") {
    webpackObj.plugins = [
        new Uglify({ include: /bundle\.js$/ })
    ];
}

module.exports = webpackObj;