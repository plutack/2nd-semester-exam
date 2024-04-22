import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    ],
  });
  
  export const stream = {
    write: message => logger.info(message.trim())
  };
  
  
  

export default logger;
