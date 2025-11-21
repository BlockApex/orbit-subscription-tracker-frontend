'use client'

import { BellIcon, Calendar, ChartColumn, House, PieChart, Plus, Search, User, Wallet2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const BottomNav = () => {
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Home', icon: House },
        { href: '/calender', label: 'Calender', icon: Calendar },
        { href: '/add', label: '', icon: Plus , dark:true},
        { href: '/stats', label: 'Stats', icon: PieChart },
        { href: '/profile', label: 'Profile', icon: User },
    ]

    return (
        <nav className='w-full lg:max-w-3xl mx-auto  flex items-center justify-center fixed bottom-0 left-0 right-0'>
            <div className='w-full max-w-[100%] bg-white shadow-nav  p-2 rounded-tl-2xl rounded-tr-2xl flex items-center justify-around'>
                {navItems.map(({ href, label, icon: Icon , dark}) => {
                    const isActive = pathname === href;

                    return (
                        <Link key={href} href={href}>
                            <div
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                                    isActive
                                        ? 'bg-primary/30 text-primary'
                                        : 'text-dark'
                                }
                                ${dark ? 'bg-primary':''}
                                `
                            }
                            >
                                <Icon
                                    className={`w-5 ${
                                        isActive ? 'text-primary' : 'text-dark'
                                    }
                                                                    ${dark ? 'text-white':''}
                                    `}
                                />
                                <span className='text-xs text-center'>{label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default BottomNav
