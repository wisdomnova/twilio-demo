// ./app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json([]);
    }

    // Map database columns to expected format
    const formattedMessages = messages?.map(msg => ({
      id: msg.id,
      from: msg.sender,
      to: msg.recipient,
      body: msg.body,
      timestamp: msg.timestamp,
      direction: msg.direction,
      status: msg.status
    })) || [];

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const message = await request.json();
    
    // Map to database column names
    const dbMessage = {
      sender: message.from,
      recipient: message.to,
      body: message.body,
      timestamp: message.timestamp,
      direction: message.direction,
      status: message.status
    };
    
    const { error } = await supabase
      .from('messages')
      .insert([dbMessage]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: 'Failed to store message' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing message:', error);
    return NextResponse.json({ success: false, error: 'Failed to store message' });
  }
}