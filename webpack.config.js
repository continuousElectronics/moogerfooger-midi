const 
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    path = require("path");

module.exports = {
    watch: true,
    target: "electron",
    entry: {
        main: ["babel-polyfill", "./src/index"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new UglifyJsPlugin({
            include: /bundle\.js$/
        })
    ],
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