module.exports = {
    apps: [
        {
            name: "niva-service",
            script: "server.js",
            env: {
                PORT: 3000,
                NODE_ENV: "production",
            },
            max_memory_restart: "500M",
            error_file: "/var/log/niva-service/error.log",
            out_file: "/var/log/niva-service/out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
        },
    ],
};
