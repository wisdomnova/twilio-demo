// ./app/api/incoming-sms/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const body = formData.get('Body') as string;
    const messageSid = formData.get('MessageSid') as string;

    const messageData = {
      id: messageSid,
      from,
      to,
      body,
      timestamp: new Date(),
      direction: 'inbound' as const,
    };

    console.log('Incoming SMS:', messageData);

    // Store the message
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/messages`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData), 
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing incoming SMS:', error);
    return NextResponse.json(
      { error: 'Failed to process incoming SMS' },
      { status: 500 }
    );
  }
}