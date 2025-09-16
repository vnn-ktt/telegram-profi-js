// import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fileSystem from "fs";
import * as dateFns from "date-fns"

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    userId?: number;
    chatId?: number;
    questionId?: number;
}

export default class Logger {
    private static _instance: Logger;
    private readonly _logDir: string;
    private _currentLogFile: string;
    private _maxFileSize: number;

    private constructor() {
        this._logDir = path.resolve(
            process.cwd(), 'logs'
        );
        this._maxFileSize = 10 * 1024; // 1MB
        this._currentLogFile = this._getCurrentLogFileName();
        this._ensureLogDirectory().then(r => r);
    }

    public static getInstance(): Logger {
        if (!Logger._instance) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    private _getCurrentLogFileName(): string {
        const date = dateFns.format(new Date(), 'yyyy-MM-dd');
        return `bot-${date}.json`;
    }

    private async _ensureLogDirectory(): Promise<void> {
        try {
            // @ts-ignore
            fileSystem.access(this._logDir);
        } catch {
            // @ts-ignore
            fileSystem.mkdir(this._logDir, { recursive: true });
        }
    }
}

// private async rotateLogIfNeeded(): Promise<void> {
//     try {
//         const filePath = path.join(this.logDir, this.currentLogFile);
//         try {
//             const stats = await fs.stat(filePath);
//             if (stats.size > this.maxFileSize) {
//     const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
//     const newFileName = `bot-${timestamp}.json`;
//     await fs.rename(filePath, path.join(this.logDir, newFileName));
//     this.currentLogFile = this.getCurrentLogFileName();
// }
// } catch {
//     // Файл не существует, ничего делать не нужно
// }
// } catch (error) {
//     console.error('Log rotation error:', error);
// }
// }
//
// private async writeToFile(entry: LogEntry): Promise<void> {
//     try {
//         await this.rotateLogIfNeeded();
//
//         const filePath = path.join(this.logDir, this.currentLogFile);
//         let logs: LogEntry[] = [];
//
// try {
//     const content = await fs.readFile(filePath, 'utf-8');
//     logs = JSON.parse(content);
// } catch {
//     // Файл не существует или пустой, начинаем новый массив
//     logs = [];
// }
//
// logs.push(entry);
//
// await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8');
// } catch (error) {
//     console.error('Failed to write log to file:', error);
// }
// }
//
// public async info(message: string, context?: Record<string, any>): Promise<void> {
//     await this.log(LogLevel.INFO, message, context);
// }
//
// public async warn(message: string, context?: Record<string, any>): Promise<void> {
//     await this.log(LogLevel.WARN, message, context);
// }
//
// public async error(message: string, context?: Record<string, any>): Promise<void> {
//     await this.log(LogLevel.ERROR, message, context);
// }
//
// public async debug(message: string, context?: Record<string, any>): Promise<void> {
//     await this.log(LogLevel.DEBUG, message, context);
// }
//
// public async log(
//     level: LogLevel,
//     message: string,
//     context?: Record<string, any>,
//     userId?: number,
//     chatId?: number,
//     questionId?: number
// ): Promise<void> {
//     const entry: LogEntry = {
//     timestamp: new Date().toISOString(),
//     level,
//     message,
//     context,
//     userId,
//     chatId,
//     questionId
// };
//
// // Также выводим в консоль для удобства разработки
// console.log(`[${level}] ${message}`, context || '');
//
// // Асинхронная запись в файл
// this.writeToFile(entry).catch(error => {
//     console.error('Failed to write log entry:', error);
// });
// }
//
// // Методы для специфичных событий бота
// public async logUserStart(userId: number, chatId: number, username?: string): Promise<void> {
//     await this.info(`User started bot`, { username, userId, chatId });
// }
//
// public async logQuestionAsked(
//     userId: number,
//     chatId: number,
//     questionId: number,
//     grade: string
// ): Promise<void> {
//     await this.info(`Question asked`, { userId, chatId, questionId, grade });
// }
//
// public async logAnswerSubmitted(
//     userId: number,
//     chatId: number,
//     questionId: number,
//     isCorrect: boolean,
//     userAnswer: string
// ): Promise<void> {
//     await this.info(`Answer submitted`, {
//         userId,
//         chatId,
//         questionId,
//         isCorrect,
//         userAnswer
//     });
// }
//
// public async logError(
//     message: string,
//     error: Error,
//     userId?: number,
//     chatId?: number
// ): Promise<void> {
//     await this.error(message, {
//         userId,
//         chatId,
//         error: {
//             name: error.name,
//             message: error.message,
//             stack: error.stack
//         }
//     });
// }
//
// // Метод для чтения логов (опционально)
// public async getLogs(limit: number = 100): Promise<LogEntry[]> {
//     try {
//         const filePath = path.join(this.logDir, this.currentLogFile);
//         const content = await fs.readFile(filePath, 'utf-8');
//         const logs: LogEntry[] = JSON.parse(content);
// return logs.slice(-limit);
// } catch {
//     return [];
// }
// }
// }
//
// // Экспорт синглтона для удобства использования
// export const logger = Logger.getInstance();