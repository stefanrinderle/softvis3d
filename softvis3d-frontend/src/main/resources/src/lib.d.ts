declare const config: {
    api: string;
    env: string;
    project: string | null;
    proxy: string | null;
};

declare module "config" {
    export default config;
}
