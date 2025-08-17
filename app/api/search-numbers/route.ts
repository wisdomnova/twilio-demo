// ./app/api/search-numbers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const areaCode = searchParams.get('areaCode');

    if (!areaCode) {
      return NextResponse.json(
        { success: false, error: 'Area code is required' },
        { status: 400 }
      );
    }

    const numbers = await client.availablePhoneNumbers('US').local.list({
      areaCode: parseInt(areaCode),
      limit: 10,
    });

    const formattedNumbers = numbers.map(number => ({
      phoneNumber: number.phoneNumber,
      friendlyName: number.friendlyName,
      locality: number.locality,
      region: number.region,
      country: number.isoCountry,
      capabilities: {
        voice: number.capabilities.voice,
        sms: number.capabilities.sms,
        mms: number.capabilities.mms,
      },
    }));

    return NextResponse.json({
      success: true,
      numbers: formattedNumbers,
    });
  } catch (error: any) {
    console.error('Error searching numbers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search numbers' },
      { status: 500 }
    );
  }
}