import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fileSystem from "fs";

export default class EnvironmentManager {
    private static _instance: EnvironmentManager;
    private constructor() {
        this.loadEnvironment();
    }

    public static getInstance(): EnvironmentManager {
        if (!EnvironmentManager._instance) {
            EnvironmentManager._instance = new EnvironmentManager();
        }
        return EnvironmentManager._instance;
    }
    public loadEnvironment(): void {
        const env = process.env.NODE_ENV || "development";
        const envPath = path.resolve(
            process.cwd(), 'source', 'config', `.env.${env}`
        );
        const rootEnvPath = path.resolve(
            process.cwd(), 'source', 'config', `.env`
        );

        if (fileSystem.existsSync(envPath)) {
            dotenv.config({path: envPath});
            console.log(`✅ Environment loaded: ${env}`)
        } else {
            if (fileSystem.existsSync(rootEnvPath)) {
                dotenv.config({ path: rootEnvPath });
                console.warn(`⚠️ Using root environment file: ${envPath}`);
            } else {
                throw new Error(`❌ Environment file not found: ${envPath}`);
            }
        }
    }
    public getVariable(key: string): string {
        const value = process.env[key];
        if (!value) throw new Error(`❌ Environment variable is not defined: ${value}`);
        return value;
    }
}