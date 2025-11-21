'use client'
import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import Image from 'next/image';
import AppLayout from '@/components/common/AppLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Subscription {
    image: string;
    name: string;
    price: string;
    type: string;
    end_at: string;
    created_at: string;
    status: string;
}

// Your subscription data
const subscriptions: Subscription[] = [
    { image: '/assets/mock/companies/2.png', name: 'ChatGpt', price: '$15.99/ mo', type: 'Manual', end_at: '2025-11-21', created_at: '19 Sep 2025', status: 'active' },
    { image: '/assets/mock/companies/3.png', name: 'ChatGpt', price: '$15.99/ mo', type: 'Manual', end_at: '2025-11-21', created_at: '19 Sep 2025', status: 'cancelled' },
    { image: '/assets/mock/companies/4.png', name: 'ChatGpt', price: '$15.99/ mo', type: 'Bank', end_at: '2025-11-22', created_at: '19 Sep 2025', status: 'active' },
    { image: '/assets/mock/companies/5.png', name: 'ChatGpt', price: '$15.99/ mo', type: 'Manual', end_at: '2025-11-22', created_at: '19 Sep 2025', status: 'cancelled' },
];

const groupedEvents = Object.values(
    subscriptions.reduce((acc: Record<string, any>, sub) => {
        if (!acc[sub.end_at]) {
            acc[sub.end_at] = { date: sub.end_at, subs: [] };
        }
        acc[sub.end_at].subs.push(sub);
        return acc;
    }, {})
);

// Map to FullCalendar events
const events = groupedEvents.map((group) => ({
    id: group.date,
    title: '', // optional
    start: group.date,
    extendedProps: { subs: group.subs } // store all subs for that date
}));

const Calendar: React.FC = () => {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState('');

    const renderEventContent = (eventInfo: EventContentArg) => {
        console.log(eventInfo, "EVENT INFO........")
        const subs: Subscription[] = eventInfo.event.extendedProps.subs;
        if (!subs || subs.length === 0) return null;

        const first = subs[0];
        const remaining = subs.slice(1);
        console.log(subs, "SUBS.........")
        return (
            <div className="flex items-center justify-center space-x-1">
                <Image
                    src={first.image}
                    alt={first.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                />
                {remaining.map((_, idx) => (
                    <div key={idx} className="text-xs font-bold text-black">
                        +{idx + 1}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <AppLayout showTopbar={false}>
            <main className="w-full h-screen relative overflow-hidden p-2 calender-container pb-56">
                <p className='text-xl text-black my-2 p-2'>Calender</p>

                <div className="flex items-center justify-start gap-4 p-2 rounded-md mb-2">
                    <button
                        onClick={() => calendarRef.current?.getApi().prev()}
                        className='px-4 py-2 bg-gray-200 rounded-2xl'
                    >
                        <ChevronLeft size={15} className='text-primary' />
                    </button>
                    <h2 className='text-xl text-black'>{currentTitle}</h2>
                    <button onClick={() => calendarRef.current?.getApi().next()}
                        className='px-4 py-2 bg-gray-200 rounded-2xl'
                    >
                        <ChevronRight size={15} className='text-primary' />
                    </button>
                </div>
                <div className='flex items-center justify-between p-2 my-2'>
                    <p className='text-base text-foreground'>Monthly Total <span className='text-secondary ms-1'>$150.84</span></p>
                    <p className='text-base text-foreground'>Upcoming  <span className='text-secondary ms-1'>$150.84</span></p>
                </div>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventContent={renderEventContent}
                    height="100%"
                    dayCellClassNames={(arg) => {
                        const classes = ['rounded-md ', 'p-2' , ""];
                        if (arg.isOther) {
                            classes.push('bg-#F5F5F5', 'opacity-10');
                        } else {
                            classes.push('bg-gray-200'); // current month days
                        }
                        return classes;
                    }}
                    headerToolbar={false}
                    datesSet={(info) => {
                        setCurrentTitle(info.view.title);
                    }}
                />
            </main>
        </AppLayout>
    );
};

export default Calendar;
