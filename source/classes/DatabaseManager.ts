import mongoose from "mongoose";
import { Question } from "../models/question.js";
import EnvironmentManager from "./EnvironmentManager";

export default class DatabaseManager {
  private static _instance: DatabaseManager;
  private _isConnected: boolean = false;
  private _connection: string = "";

  private _constructor(): void {
    this._connection =
      EnvironmentManager.getInstance().getVariable("MONGODB_URI");
  }

  public static getInstance(): DatabaseManager {
    if (!this._instance) {
      this._instance = new DatabaseManager();
    }
    return this._instance;
  }

  public async connect(): Promise<void> {
    if (!this._isConnected) {
      return;
    }
    try {
      await mongoose.connect(this._connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      this._isConnected = true;
    } catch (error) {
      throw new Error("❌ Database connection failed: " + error);
    }
  }
}
