// src/lib/logger.ts
// Winston logger — Node.js runtime only
// DO NOT import in middleware.ts (Edge Runtime) 
// Use in: API routes, services, server components
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const {combine,timestamp,printf,colorize } =winston.format;
//winston.format本身不只是個function,它還有其他的「屬性」
//ex:format.combine=....; format.printf=......
//別忘了,javascript 的function也可以是個object--prototyping vs oop
//var 可以用「.」來「黏貼」其他東西/函數,function也可以!!
const logFormat=printf(({level,message,timestamp,...meta})=>{
  const metaString=Object.keys(meta).length?
   ''+JSON.stringify(meta):'';
   return `${timestamp}[${level.toUpperCase()}] ${message}${metaString}`;
});
const logger=winston.createLogger(
    {
        level:process.env.NODE_ENV==='production'?'info':'debug',
        transports:[
            // Console — colored, for development
            new winston.transports.Console({
                format: combine(
                    colorize(),
                    timestamp({ format: 'HH:mm:ss' }),
                    logFormat
                )
            }),
            // All logs — daily rotating file
            new DailyRotateFile({
                filename:    'logs/app-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                format:      combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
                maxFiles:    '30d',
                maxSize:     '20m'
            }),
            // Errors only — separate file for quick scanning
            new DailyRotateFile({
                filename:    'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                level:       'error',
                format:      combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
                maxFiles:    '30d',
                maxSize:     '20m'
            })          
        ]

    }
);
export default logger;