// src/app/(booking)/[username]/[booking-uri]/[booking-time]/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Booking',
  description: 'Schedule a meeting',
};

export default function BookingTimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
