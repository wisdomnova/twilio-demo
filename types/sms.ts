export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  status?: string;
}

export interface SendSMSRequest {
  to: string;
  body: string;
}

export interface SendSMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}