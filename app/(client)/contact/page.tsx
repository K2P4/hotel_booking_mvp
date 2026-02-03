import React from 'react';
import { Phone, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const contactMethods = [
    {
      title: 'General Reservations',
      description: 'Bookings, modifications, and rate inquiries.',
      detail: '+95 9968213232',
      icon: <Phone className="w-5 h-5 text-primary" />,
      action: 'Call Now',
    },
    {
      title: 'Concierge Services',
      description: 'Dining, transport, and local tours.',
      detail: 'support@hotelbooking.com',
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
      action: 'Send Email',
    },
    {
      title: 'Corporate & Events',
      description: 'Group bookings and conference room rentals.',
      detail: '+95 9968213231',
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      action: 'Inquire',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <section className="bg-slate-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">How Can We Help You?</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Whether you're planning a weekend getaway or a corporate retreat, our dedicated team is here to ensure your stay is seamless.</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Contact Cards  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <div className="mb-2">{method.icon}</div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-slate-600 text-lg mb-4">{method.detail}</p>
                <Button className="w-full">{method.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card className="flex flex-col shadow-sm justify-center">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Our Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                37 Kabar Aye Pagoda Road <br />
                Mayangone Tsp <br />
                Yangon
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Reception open 24 hours daily</span>
              </div>
              <Button className="mt-4">Get Directions</Button>
            </CardContent>
          </Card>

          <div className="h-[200px] md:h-[300px] bg-slate-200 rounded-xl overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              alt="Map Location"
              className="w-full h-full object-center opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
