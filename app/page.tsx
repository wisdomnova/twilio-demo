// ./app/page.tsx
import SMSForm from '@/components/SMSForm';
import SMSLogger from '@/components/SMSLogger';
import NumberSearch from '@/components/NumberSearch';

export default function Home() {
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Twilio SMS Demo
          </h1>
          <p className="text-gray-600">
            Search phone numbers, send and receive SMS messages using Twilio API
          </p>
          {twilioNumber && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <p className="text-sm text-blue-800 mb-1">
                <strong>Send SMS to this number to see it appear in the SMS Log:</strong>
              </p>
              <p className="text-xl font-mono font-bold text-blue-900">
                {twilioNumber}
              </p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <NumberSearch />
          <SMSForm />
          <SMSLogger />
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Built with Next.js and Twilio</p>
        </footer>
      </div>
    </div>
  );
}