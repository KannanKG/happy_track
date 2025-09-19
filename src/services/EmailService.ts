import * as nodemailer from 'nodemailer';
import { EmailConfig } from '../types';
import { format } from 'date-fns';

export interface EmailAttachment {
  filename: string;
  path: string;
  contentType?: string;
}

export interface EmailOptions {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure, // true for 465, false for other ports
      auth: {
        user: config.username,
        pass: config.password,
      },
      // Additional options for better compatibility
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  /**
   * Send email with optional attachments
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.config.fromEmail,
        to: options.to.join(', '),
        subject: options.subject,
        text: options.body,
        html: this.convertToHtml(options.body),
      };

      if (options.cc && options.cc.length > 0) {
        mailOptions.cc = options.cc.join(', ');
      }

      if (options.bcc && options.bcc.length > 0) {
        mailOptions.bcc = options.bcc.join(', ');
      }

      if (options.attachments && options.attachments.length > 0) {
        mailOptions.attachments = options.attachments.map(att => ({
          filename: att.filename,
          path: att.path,
          contentType: att.contentType,
        }));
      }

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send report email using configured template
   */
  async sendReportEmail(
    startDate: Date,
    endDate: Date,
    csvFilePath: string,
    summaryFilePath?: string,
    additionalInfo?: {
      totalUsers: number;
      totalActivities: number;
      testRailActivities: number;
      jiraActivities: number;
    }
  ): Promise<void> {
    try {
      const dateRange = `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
      
      // Process subject template
      const subject = this.config.subject.replace(/\{\{dateRange\}\}/g, dateRange);
      
      // Process body template
      let body = this.config.bodyTemplate.replace(/\{\{dateRange\}\}/g, dateRange);
      
      // Add summary information if available
      if (additionalInfo) {
        body += '\n\nReport Summary:';
        body += `\n- Total Users: ${additionalInfo.totalUsers}`;
        body += `\n- Total Activities: ${additionalInfo.totalActivities}`;
        body += `\n- TestRail Activities: ${additionalInfo.testRailActivities}`;
        body += `\n- Jira Activities: ${additionalInfo.jiraActivities}`;
      }

      body += '\n\nPlease find the detailed activity report attached.';
      body += '\n\nThis report was generated automatically by Happy Track.';

      // Prepare attachments
      const attachments: EmailAttachment[] = [
        {
          filename: `activity-report-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`,
          path: csvFilePath,
          contentType: 'text/csv',
        },
      ];

      if (summaryFilePath) {
        attachments.push({
          filename: `activity-summary-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`,
          path: summaryFilePath,
          contentType: 'text/csv',
        });
      }

      await this.sendEmail({
        to: this.config.toEmails,
        cc: this.config.ccEmails && this.config.ccEmails.length > 0 ? this.config.ccEmails : undefined,
        subject,
        body,
        attachments,
      });
    } catch (error) {
      console.error('Failed to send report email:', error);
      throw new Error('Failed to send report email');
    }
  }

  /**
   * Send test email to verify configuration
   */
  async sendTestEmail(): Promise<void> {
    try {
      const subject = 'Happy Track - Email Configuration Test';
      const body = `This is a test email to verify your Happy Track email configuration.

Email Settings:
- SMTP Host: ${this.config.smtpHost}
- SMTP Port: ${this.config.smtpPort}
- From Email: ${this.config.fromEmail}
- Secure Connection: ${this.config.smtpSecure ? 'Yes' : 'No'}

If you received this email, your email configuration is working correctly!

Timestamp: ${new Date().toISOString()}`;

      await this.sendEmail({
        to: this.config.toEmails,
        cc: this.config.ccEmails && this.config.ccEmails.length > 0 ? this.config.ccEmails : undefined,
        subject,
        body,
      });
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw new Error('Failed to send test email');
    }
  }

  /**
   * Convert plain text to HTML for better email formatting
   */
  private convertToHtml(text: string): string {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<p><\/p>/g, '<br>');
  }

  /**
   * Validate email configuration
   */
  validateConfig(): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.config.smtpHost) {
      errors.push('SMTP host is required');
    }

    if (!this.config.smtpPort || this.config.smtpPort <= 0) {
      errors.push('Valid SMTP port is required');
    }

    if (!this.config.username) {
      errors.push('SMTP username is required');
    }

    if (!this.config.password) {
      errors.push('SMTP password is required');
    }

    if (!this.config.fromEmail) {
      errors.push('From email address is required');
    }

    if (!this.config.toEmails || this.config.toEmails.length === 0) {
      errors.push('At least one recipient email address is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (this.config.fromEmail && !emailRegex.test(this.config.fromEmail)) {
      errors.push('From email address format is invalid');
    }

    this.config.toEmails.forEach((email, index) => {
      if (!emailRegex.test(email)) {
        errors.push(`To email address ${index + 1} format is invalid`);
      }
    });

    if (this.config.ccEmails) {
      this.config.ccEmails.forEach((email, index) => {
        if (!emailRegex.test(email)) {
          errors.push(`CC email address ${index + 1} format is invalid`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get email service status
   */
  async getStatus(): Promise<{
    configured: boolean;
    connected: boolean;
    validation: {
      isValid: boolean;
      errors: string[];
    };
  }> {
    const validation = this.validateConfig();
    
    let connected = false;
    if (validation.isValid) {
      try {
        connected = await this.testConnection();
      } catch (error) {
        console.error('Email connection test failed:', error);
      }
    }

    return {
      configured: validation.isValid,
      connected,
      validation,
    };
  }

  /**
   * Close email service connection
   */
  async close(): Promise<void> {
    try {
      this.transporter.close();
    } catch (error) {
      console.error('Error closing email service:', error);
    }
  }
}

export default EmailService;