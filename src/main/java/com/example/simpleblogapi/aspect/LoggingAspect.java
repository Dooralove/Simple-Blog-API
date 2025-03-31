package com.example.simpleblogapi.aspect;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LogManager.getLogger(LoggingAspect.class);

    @Before("execution(* com.example.simpleblogapi.controllers.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        if (logger.isInfoEnabled()) {
            logger.info("Executing method: {}", joinPoint.getSignature().toShortString());
        }
    }


    @After("execution(* com.example.simpleblogapi.controllers.*.*(..))")
    public void logAfter() {
        logger.info("Method execution completed.");
    }

    @AfterThrowing(value = "execution(* com.example.simpleblogapi.controllers.*.*(..))",
            throwing = "exception")
    public void logAfterThrowing(Exception exception) {
        logger.error("An error occurred: {}", exception.getMessage(), exception);
    }
}
