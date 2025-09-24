export enum LogLevel {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  DEBUG = "debug",
}

export interface BotLogContext {
  userId?: number;
  chatId?: number;
  messageId?: number;
  questionId?: number;
  grade?: string;
}
