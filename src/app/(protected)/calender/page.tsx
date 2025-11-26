'use client';

import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventContentArg, DatesSetArg } from '@fullcalendar/core';
import Image from 'next/image';
import AppLayout from '@/components/common/AppLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMySubscriptions } from '@/services/subscription.service';
import { getUserSpend } from '@/services/auth.service';
import { Spinner } from '@/components/common/Spinner';
import { Modal } from '@/components/common/Modal';
import { useRouter } from 'next/navigation';
import SubscriptionLine from '@/components/SubscriptionLine';
import { format, formatDistanceToNow } from 'date-fns';

// ------------------------
// ✅ Updated Interfaces (matching API source of truth)
// ------------------------

interface ApiSubscription {
  _id: string;
  merchant: { name: string; logo: string };
  priceData: { amount: number; decimals: number };
  isAutoTracked: boolean;
  isOnFreeTrial: boolean;
  isActive: boolean;
  nextPaymentDate: string;
  createdAt: string;
  packageName?: string;
  category?: {
    _id: string;
    name: string;
    icon: string;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
  };
  frequency?: {
    text: string;
    seconds: number;
  };
}

interface Subscription {
  _id: string;
  image: string;
  name: string;
  price: string;
  type: string;
  end_at: string;
  created_at: string;
  status: string;
  packageName?: string;
  category?: {
    _id: string;
    name: string;
    icon: string;
  };
  frequency?: {
    text: string;
    seconds: number;
  };
  isOnFreeTrial?: boolean;
}

interface SpendMonth {
  month: number;
  year: number;
  monthlySpend: string;
  upcoming: string;
}

interface CalendarEvent {
  id: string;
  start: string;
  title: string;
  extendedProps: {
    subs: Subscription[];
  };
}

// ------------------------
// ✅ Robust Component (UI untouched, data safely fitted)
// ------------------------

const CalendarPage: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const [currentTitle, setCurrentTitle] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [monthwiseSpend, setMonthwiseSpend] = useState<SpendMonth[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState('0.00');
  const [upcomingTotal, setUpcomingTotal] = useState('0.00');
  const [selectedSubs, setSelectedSubs] = useState<Subscription[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // ------------------------
  // ✅ Mapping API → UI model (category & frequency now objects)
  // ------------------------

  const mapToSubscription = (item: ApiSubscription): Subscription => {
    const price = (item.priceData.amount / 10 ** item.priceData.decimals).toFixed(2);

    return {
      _id: item._id,
      image: item.merchant.logo,
      name: item.merchant.name,
      price: `${item.category?.icon ? '' : ''}$${price}`, // UI untouched
      type: item.isAutoTracked ? 'Bank' : 'Manual',
      end_at: item.nextPaymentDate,
      created_at: item.createdAt,
      status: item.isActive ? 'active' : 'cancelled',
      packageName: item.packageName,
      
      // ✅ category fitted as object (UI expects icon, name)
      category: item.category
        ? {
            _id: item.category._id,
            name: item.category.name,
            icon: item.category.icon,
          }
        : undefined,

      // ✅ frequency fitted as object (UI expects text)
      frequency: item.frequency
        ? {
            text: item.frequency.text,
            seconds: item.frequency.seconds ?? item.frequency.seconds,
          }
        : undefined,

      isOnFreeTrial: item.isOnFreeTrial,
    };
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [subscriptionsRes, spendRes] = await Promise.all([
          getMySubscriptions(),
          getUserSpend(),
        ]);

        // ✅ Strongly typed result
        setSubscriptions(subscriptionsRes.map(mapToSubscription));
        setMonthwiseSpend(spendRes.monthwiseSpend);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleShow = (subs: Subscription[]) => {
    setSelectedSubs(subs);
  };

  // ------------------------
  // ✅ Grouped calendar events typed safely
  // ------------------------

  const groupedEvents: CalendarEvent[] = Object.values(
    subscriptions.reduce((acc: Record<string, Subscription[]>, sub) => {
      if (!acc[sub.end_at]) acc[sub.end_at] = [];
      acc[sub.end_at].push(sub);
      return acc;
    }, {})
  ).map((subs, idx) => ({
    id: `${subs[0].end_at}-${idx}`,
    start: subs[0].end_at,
    title: '',
    extendedProps: { subs },
  }));

  const renderEventContent = (eventInfo: EventContentArg) => {
    const subs: Subscription[] = eventInfo.event.extendedProps.subs;
    if (!subs || subs.length === 0) return null;

    const first = subs[0];
    const count = subs.length - 1;

    return (
      <div className="flex items-center justify-center space-x-1 cursor-pointer" onClick={() => handleShow(subs)}>
        <Image src={first.image} alt={first.name} width={25} height={25} className="rounded-full" unoptimized />
        {count > 0 && <span className="text-sm font-semibold text-black">+{count}</span>}
      </div>
    );
  };

  const handleMonthChange = (info: DatesSetArg) => {
    setCurrentTitle(info.view.title);

    const viewDate = info.start;
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();

    const match = monthwiseSpend.find((m) => m.month === month && m.year === year);

    if (match) {
      setMonthlyTotal(match.monthlySpend);
      setUpcomingTotal(match.upcoming);
    } else {
      setMonthlyTotal('0.00');
      setUpcomingTotal('0.00');
    }
  };

  if (loading) {
    return (
      <AppLayout showTopbar={false}>
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  const renderImportType = (type: string) => {
    if (type.toLowerCase() === 'manual') {
      return (
        <span className="text-xs text-danger bg-danger/10 px-4 py-1 rounded-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger inline-block" /> Manual
        </span>
      );
    }
    return (
      <span className="text-xs text-success bg-success/10 px-4 py-1 rounded-2xl flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success inline-block" /> Bank
      </span>
    );
  };

  return (
    <AppLayout showTopbar={false}>
      <main className="w-full h-screen relative overflow-hidden p-2 calender-container pb-56">
        <p className="text-xl text-black my-2 p-2">Calendar</p>

        <div className="flex items-center justify-start gap-4 p-2 rounded-md mb-2">
          <button onClick={() => calendarRef.current?.getApi().prev()} className="px-4 py-2 bg-gray-200 rounded-2xl">
            <ChevronLeft size={15} className="text-primary" />
          </button>

          <h2 className="text-xl text-black">{currentTitle}</h2>

          <button onClick={() => calendarRef.current?.getApi().next()} className="px-4 py-2 bg-gray-200 rounded-2xl">
            <ChevronRight size={15} className="text-primary" />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 my-2">
          <p className="text-base text-foreground">
            Monthly Total <span className="text-secondary ms-1">${monthlyTotal}</span>
          </p>
          <p className="text-base text-foreground">
            Upcoming <span className="text-secondary ms-1">${upcomingTotal}</span>
          </p>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={groupedEvents}
          eventContent={renderEventContent}
          height="100%"
          headerToolbar={false}
          dayCellClassNames={(arg) => {
            const classes = ['rounded-md', 'p-2'];
            if (arg.isOther) classes.push('bg-gray-100', 'opacity-10');
            else classes.push('bg-gray-200');
            return classes;
          }}
          datesSet={handleMonthChange}
        />

        <Modal isOpen={!!selectedSubs} onClose={() => setSelectedSubs(undefined)} title="">
          <div className="flex flex-col gap-4 pb-20">
            {selectedSubs?.map((sub, i) => {
              return (
                <div
                  key={i}
                  onClick={() => router.push(`/subscription/${sub._id}`)}
                  className="relative w-full bg-white rounded-tl-2xl rounded-tr-2xl p-4"
                >
                  <div className="relative w-full flex items-start justify-between pb-4">
                    <section className="flex flex-start gap-3">
                      <div>
                        <Image src={sub.image} width={50} height={50} alt={sub.name} className="rounded-xl" unoptimized />
                      </div>

                      <div>
                        <h6 className="text-lg text-black">
                          {sub.name}{' '}
                          <small className="text-sm text-foreground ms-2">({sub.packageName})</small>
                        </h6>

                        {/* ✅ Now TS safe (UI unchanged) */}
                        <p className="text-sm text-foreground flex items-center gap-1">
                          <span>{sub.category?.icon}</span> {sub.category?.name}
                        </p>

                        <p className="text-base text-foreground mb-2">
                          {sub.price} / {sub.frequency?.text}
                        </p>

                        <div className="flex items-center gap-2">
                          {renderImportType(sub.type)}
                          {sub.isOnFreeTrial && (
                            <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg">
                              Free Trial Active
                            </p>
                          )}
                        </div>
                      </div>
                    </section>

                    <section className="flex flex-col items-end justify-between">
                      <small className="text-sm text-foreground">
                        {format(new Date(sub.created_at), 'd MMM yyyy')}
                      </small>
                      <p className="absolute bottom-0 right-0 text-base text-black">
                        {formatDistanceToNow(new Date(sub.end_at), { addSuffix: false })}
                      </p>
                    </section>
                  </div>

                  <SubscriptionLine type={sub.type} />
                </div>
              );
            })}
          </div>
        </Modal>
      </main>
    </AppLayout>
  );
};

export default CalendarPage;
