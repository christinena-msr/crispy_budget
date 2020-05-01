const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config =  {
    entry: {
        app: "./assets/index.js"
    }, 
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.>js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel/preset-env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new WebpackPwaManifest({
            name: "Budget Tracker App",
            short_name: "Budget Tracker",
            description: "An application that allows you to manage your finances.",
            background_color: "#01579b",
            theme_color: "#ffffff",
            "theme-color": "#ffffff",
            start_url: "/",
            icons: [{
                src: path.resolve("icons/icon-192x192.png"),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join("assets", "icons")
            }]
        })
    ]
}

module.exports = config;