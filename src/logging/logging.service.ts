import { ConsoleLogger, Injectable } from '@nestjs/common';
import 'dotenv/config';
import { access, appendFile, mkdir, readdir, stat } from 'fs/promises';
import { resolve } from 'path';

const logLevels = ['fatal', 'error', 'log'] as const;
const logFileExt = 'txt';
const logDir = resolve(__dirname, '../../..', 'app-logs');
type LogLevel = (typeof logLevels)[number];

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logLevel = 1;
  private maxLogFileSize: number | null = null;

  constructor() {
    super();

    const level = logLevels.indexOf(process.env.LOG_LEVEL as any);
    if (level !== -1) {
      this.logLevel = level;
    }

    const envMaxLogFileSize = +process.env.MAX_LOG_SIZE;
    if (!isNaN(envMaxLogFileSize) && envMaxLogFileSize > 0) {
      this.maxLogFileSize = envMaxLogFileSize * 1024;
    }
  }

  async log(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 2) {
      await this.writeLog('log', message, ...optionalParams);
    }
  }

  async fatal(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 0) {
      await this.writeLog('fatal', message, ...optionalParams);
    }
  }

  async error(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 1) {
      await this.writeLog('error', message, ...optionalParams);
    }
  }

  private async writeLog(
    logLevelName: LogLevel,
    message: any,
    ...optionalParams: any[]
  ) {
    const params = optionalParams.filter((param) => !!param);
    if (logLevelName !== 'log') {
      await this.writeToFile('log', message, ...optionalParams);
    }
    super[logLevelName](message, ...params);
    await this.writeToFile(logLevelName, message, ...optionalParams);
  }

  private async writeToFile(
    logLevel: LogLevel,
    message: any,
    ...optionalParams: any[]
  ) {
    const dir = resolve(logDir, logLevel);
    try {
      await access(dir);
    } catch (error) {
      await mkdir(dir, { recursive: true });
    }
    const files = await readdir(dir, { withFileTypes: true });
    let fileName = files.reduce((result, file) => {
      const parts = file.name.split('.');
      const resultNum = +result.split('.')[1];
      const currentNum = +parts[1];
      if (
        parts.length === 3 &&
        parts[0] === logLevel &&
        /^\d+$/.test(parts[1]) &&
        parts[2] === logFileExt
      ) {
        return currentNum > resultNum ? file.name : result;
      }
      return result;
    }, `${logLevel}.1.${logFileExt}`);
    let filePath = resolve(dir, fileName);
    let data = `Timestamp: ${new Date().toISOString()}\n`;

    const stringify = (value: unknown) => {
      if (typeof value === 'object') {
        if (value instanceof Error) {
          return `${value.name}: ${value.message}\n`;
        }
        if (value instanceof Promise) {
          return 'Reason: ';
        }
        return JSON.stringify(value, null, 2) + '\n';
      }
      return `${value}\n`;
    };

    data += stringify(message);
    for (const param of optionalParams) {
      if (param) {
        data += stringify(param);
      }
    }
    data += '\n';
    if (this.maxLogFileSize) {
      try {
        if ((await stat(filePath)).size + data.length > this.maxLogFileSize) {
          const fileNum = +fileName.split('.')[1] + 1;
          fileName = `${logLevel}.${fileNum}.${logFileExt}`;
          filePath = resolve(dir, fileName);
        }
      } catch {}
    }
    await appendFile(filePath, data);
  }
}
