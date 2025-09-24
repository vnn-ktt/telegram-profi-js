import * as dotenv from "dotenv";
import * as path from "path";
import * as fileSystem from "fs";

/**
 * Менеджер управления переменными окружения.
 * @class EnvironmentManager
 */
export default class EnvironmentManager {
  private static _instance: EnvironmentManager;

  /**
   * Приватный конструктор (Singleton pattern)
   * Автоматически загружает переменные окружения при создании экземпляра
   * @private
   */
  private constructor() {
    this.loadEnvironment();
  }

  /**
   * Получение экземпляра EnvironmentManager (Singleton)
   * @public
   * @static
   * @returns {EnvironmentManager} Единственный экземпляр менеджера окружения
   * @example
   * const envManager = EnvironmentManager.getInstance();
   * const token = envManager.getVariable('BOT_TOKEN');
   */
  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager._instance) {
      EnvironmentManager._instance = new EnvironmentManager();
    }
    return EnvironmentManager._instance;
  }

  /**
   * Загрузка переменных окружения из файлов
   * Приоритет загрузки:
   * 1. Файл окружения по NODE_ENV (например: .env.development)
   * 2. Основной файл .env (если файл окружения не найден)
   * 3. Исключение, если ни один файл не найден
   * @public
   * @throws {Error} Если не найден ни один файл окружения
   * @example
   * envManager.loadEnvironment();
   */
  public loadEnvironment(): void {
    const env = process.env.NODE_ENV || "development";
    const envPath = path.resolve(
      process.cwd(),
      "source",
      "config",
      `.env.${env}`
    );
    const rootEnvPath = path.resolve(process.cwd(), "source", "config", `.env`);

    if (fileSystem.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    } else {
      if (fileSystem.existsSync(rootEnvPath)) {
        dotenv.config({ path: rootEnvPath });
      } else {
        throw new Error(`❌ Environment file not found: ${envPath}`);
      }
    }
  }

  /**
   * Получение значения переменной окружения
   * @public
   * @param {string} key - Ключ переменной окружения
   * @returns {string} Значение переменной окружения
   * @throws {Error} Если переменная не определена или пустая
   * @example
   * const botToken = envManager.getVariable('BOT_TOKEN');
   * const apiUrl = envManager.getVariable('API_URL');
   */
  public getVariable(key: string): string {
    const value = process.env[key];
    if (!value)
      throw new Error(`❌ Environment variable is not defined: ${value}`);
    return value;
  }

  /**
   * Безопасное получение переменной окружения (без исключения)
   * @public
   * @param {string} key - Ключ переменной окружения
   * @param {string} [defaultValue] - Значение по умолчанию (опционально)
   * @returns {string | undefined} Значение переменной или undefined
   * @example
   * const port = envManager.getVariableSafe('PORT', '3000');
   * const optionalVar = envManager.getVariableSafe('OPTIONAL_VAR');
   */
  public getVariableSafe(
    key: string,
    defaultValue?: string
  ): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * Проверка существования переменной окружения
   * @public
   * @param {string} key - Ключ переменной окружения
   * @returns {boolean} true если переменная существует и не пустая
   * @example
   * if (envManager.hasVariable('DEBUG_MODE')) {
   *   // включить debug режим
   * }
   */
  public hasVariable(key: string): boolean {
    return !!process.env[key];
  }
}
