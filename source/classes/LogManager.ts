import * as winston from "winston";
import * as path from "path";
import "winston-daily-rotate-file";

interface LogError {
  message: string;
  stack?: string;
  name: string;
}

interface LogMetadata {
  error?: LogError | unknown;
  [key: string]: unknown;
}

enum LogLevel {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  DEBUG = "debug",
}

interface BotLogContext {
  userId?: number;
  chatId?: number;
  messageId?: number;
  questionId?: number;
  grade?: string;
}

/**
 * Менеджер логирования для приложения на основе Winston.
 * @class LogManager
 */
export default class LogManager {
  private static _instance: LogManager;
  private readonly _logger: winston.Logger;

  /**
   * Получение экземпляра LogManager (Singleton)
   * @public
   * @static
   * @returns {LogManager} Единственный экземпляр менеджера логирования
   * @example
   * const logger = LogManager.getInstance();
   * logger.info("Application started");
   */
  public static getInstance(): LogManager {
    if (!LogManager._instance) {
      LogManager._instance = new LogManager();
    }
    return LogManager._instance;
  }

  /**
   * Приватный конструктор (Singleton pattern)
   * Инициализирует конфигурацию логгера с транспортами для:
   * - Консоли (разные форматы для development/production)
   * - Ротируемых файлов (ежедневное обновление)
   * - Файлов исключений и rejection'ов
   * @private
   * @throws {Error} Если не удалось создать директорию логов
   */
  private constructor() {
    const logDir = path.resolve(process.cwd(), "source", "logs");
    this._logger = winston.createLogger({
      level: process.env.NODE_ENV === "product" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: "javascript-interview-bot" },
      /**
       * Транспорты для логирования:
       * 1. Console - цветной вывод для разработки
       * 2. DailyRotateFile - ротируемые файлы для application логов
       * 3. DailyRotateFile - ротируемые файлы для error логов
       * 4. File - debug логи только в не-production окружениях
       */
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, stack, ...meta }) => {
                return `${timestamp} ${level}: ${message} ${
                  stack ? `\n${stack}` : ""
                } ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
              }
            )
          ),
        }),
        new winston.transports.DailyRotateFile({
          filename: path.resolve(logDir, "application-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxSize: "10m",
          maxFiles: "30d",
          level: LogLevel.INFO,
        }),
        new winston.transports.DailyRotateFile({
          filename: path.resolve(logDir, "error-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxSize: "10m",
          maxFiles: "30d",
          level: LogLevel.ERROR,
        }),
        ...(process.env.NODE_ENV !== "product"
          ? [
              new winston.transports.File({
                filename: path.resolve(logDir, "debug.log"),
                level: LogLevel.DEBUG,
              }),
            ]
          : []),
      ],
      /**
       * Обработчики неперехваченных исключений
       */
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(logDir, "exceptions.log"),
        }),
      ],
      /**
       * Обработчики необработанных отказов
       */
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(logDir, "rejections.log"),
        }),
      ],
    });
    process.on("uncaughtException", (error) => {
      this.error("uncaughtException", error);
      process.exit(1);
    });
  }

  /**
   * Логирование ошибок с дополнительными метаданными
   * @public
   * @param {string} message - Сообщение об ошибке
   * @param {Error | any} [error] - Объект ошибки (опционально)
   * @param {BotLogContext} [context] - Контекст логирования (опционально)
   * @example
   * logger.error("Database connection failed", error, { userId: 123 });
   */
  public error(message: string, error?: Error, context?: BotLogContext): void {
    const metadata = this._prepareMetadata(error, context);
    const errorMess = "❌️" + message;
    this._logger.error(errorMess, metadata);
  }

  /**
   * Логирование предупреждений
   * @public
   * @param {string} message - Сообщение предупреждения
   * @param {BotLogContext} [context] - Контекст логирования (опционально)
   * @example
   * logger.warn("API rate limit approaching", { endpoint: "/users" });
   */
  public warn(message: string, context?: BotLogContext): void {
    const warnMess = "⚠️️" + message;
    this._logger.warn(warnMess, context);
  }

  /**
   * Логирование информационных сообщений
   * @public
   * @param {string} message - Информационное сообщение
   * @param {BotLogContext} [context] - Контекст логирования (опционально)
   * @example
   * logger.info("User registered successfully", { userId: 456 });
   */
  public info(message: string, context?: BotLogContext): void {
    const infoMess = "ℹ️" + message;
    this._logger.info(infoMess, context);
  }

  /**
   * Логирование отладочной информации
   * @public
   * @param {string} message - Отладочное сообщение
   * @param {BotLogContext} [context] - Контекст логирования (опционально)
   * @example
   * logger.debug("Database query executed", { queryTime: "120ms" });
   */
  public debug(message: string, context?: BotLogContext): void {
    const debugMess = "🧑‍🔧️" + message;
    this._logger.debug(debugMess, context);
  }

  /**
   * Подготовка метаданных для логирования ошибок
   * @private
   * @param {Error | unknown} [error] - Объект ошибки
   * @param {BotLogContext} [context] - Контекст логирования
   * @returns {LogMetadata} Объект с подготовленными метаданными
   */
  private _prepareMetadata(
    error?: Error | unknown,
    context?: BotLogContext
  ): LogMetadata {
    const metadata: LogMetadata = { ...context };
    if (error instanceof Error) {
      metadata.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      metadata.error = error;
    }
    return metadata;
  }

  /**
   * Создание дочернего логгера с наследованием контекста
   * @public
   * @param {BotLogContext} context - Контекст для дочернего логгера
   * @returns {winston.Logger} Дочерний логгер Winston
   * @example
   * const userLogger = logger.child({ module: "user-service" });
   * userLogger.info("User created");
   */
  public child(context: BotLogContext): winston.Logger {
    return this._logger.child(context);
  }
}
