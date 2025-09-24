import mongoose from 'mongoose';
import { Question } from '../database/models/question.js';

export default class DatabaseManager {
    private static _instance: DatabaseManager;
    private _isConnected: boolean = false;
}