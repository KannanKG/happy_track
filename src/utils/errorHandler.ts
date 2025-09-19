export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  API = 'API',
  AUTHENTICATION = 'AUTHENTICATION',
  FILE_SYSTEM = 'FILE_SYSTEM',
  EMAIL = 'EMAIL',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
  timestamp: Date;
}

export class AppErrorHandler {
  static createError(type: ErrorType, message: string, details?: string, code?: string): AppError {
    return {
      type,
      message,
      details,
      code,
      timestamp: new Date()
    };
  }

  static handleApiError(error: any, serviceName: string): AppError {
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      let type = ErrorType.API;
      let message = `${serviceName} API error`;

      if (status === 401 || status === 403) {
        type = ErrorType.AUTHENTICATION;
        message = `Authentication failed for ${serviceName}`;
      }

      return this.createError(
        type,
        message,
        error.response.data?.message || error.message,
        status.toString()
      );
    } else if (error.request) {
      // Network error
      return this.createError(
        ErrorType.NETWORK,
        `Failed to connect to ${serviceName}`,
        'Please check your internet connection and API URL',
        'NETWORK_ERROR'
      );
    } else {
      // Other error
      return this.createError(
        ErrorType.UNKNOWN,
        `Unexpected error in ${serviceName}`,
        error.message
      );
    }
  }

  static handleFileSystemError(error: any, operation: string): AppError {
    return this.createError(
      ErrorType.FILE_SYSTEM,
      `File system error during ${operation}`,
      error.message,
      error.code
    );
  }

  static handleEmailError(error: any): AppError {
    return this.createError(
      ErrorType.EMAIL,
      'Failed to send email',
      error.message,
      error.code
    );
  }

  static getErrorMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return `Validation Error: ${error.message}`;
      case ErrorType.NETWORK:
        return `Network Error: ${error.message}`;
      case ErrorType.API:
        return `API Error: ${error.message}`;
      case ErrorType.AUTHENTICATION:
        return `Authentication Error: ${error.message}`;
      case ErrorType.FILE_SYSTEM:
        return `File Error: ${error.message}`;
      case ErrorType.EMAIL:
        return `Email Error: ${error.message}`;
      default:
        return `Error: ${error.message}`;
    }
  }

  static getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.NETWORK:
        return 'Unable to connect to the service. Please check your internet connection.';
      case ErrorType.API:
        return 'Service is temporarily unavailable. Please try again later.';
      case ErrorType.AUTHENTICATION:
        return 'Authentication failed. Please check your credentials.';
      case ErrorType.FILE_SYSTEM:
        return 'Unable to access file. Please check permissions.';
      case ErrorType.EMAIL:
        return 'Failed to send email. Please check your email configuration.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}