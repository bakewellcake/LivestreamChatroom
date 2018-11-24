var VueLoaderPlugin = require('vue-loader/lib/plugin')
var path = require('path')

module.exports = {
    target: 'web',
    devtool: '#source-map',
    mode: 'development',
    entry: './views/index.js',
    node: {
        fs: 'empty'
    },
    output: {
        path: __dirname,
        filename: './public/build/bundle.[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader', 'cache-loader']
                //include: path.resolve(__dirname, 'views')
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
            //     loader: 'url-loader?limit=100000'
            // },
            {
                test: /\.js$/,
                use: ['cache-loader']
            }
        ],
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}