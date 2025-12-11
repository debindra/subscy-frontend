'use client';

import { NOTIFICATION_CHANNELS } from '@/lib/constants/landing';
import { getNotificationChannelIcon } from '@/lib/utils/icons';

export function NotificationChannelsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-label="Integrations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
            Notification Channels
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Get alerts where you need them</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Receive notifications via email, SMS, and push notifications—choose what works best for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {NOTIFICATION_CHANNELS.map((channel) => (
            <div 
              key={channel.name} 
              className="group flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-50 to-brand-accent-50 text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {typeof channel.channel === 'string' ? getNotificationChannelIcon(channel.channel) : null}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{channel.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{channel.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
