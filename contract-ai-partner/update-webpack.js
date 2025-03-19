const fs = require("fs");
const path = require("path");

const webpackConfigPath = path.resolve(
    __dirname,
    "node_modules/react-scripts/config/webpack.config.js",
);
const fallbackConfig = `fallback: { path: require.resolve('path-browserify') },`;

fs.readFile(webpackConfigPath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading Webpack config:", err);
        process.exit(1);
    }

    if (!data.includes(fallbackConfig)) {
        const updatedData = data.replace(
            /resolve:\s*{/,
            `resolve: {\n${fallbackConfig}`,
        );

        fs.writeFile(webpackConfigPath, updatedData, "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Error updating Webpack config:", writeErr);
                process.exit(1);
            }
            console.log("✅ Webpack config updated successfully.");
        });
    } else {
        console.log("✅ Webpack config already updated.");
    }
});
