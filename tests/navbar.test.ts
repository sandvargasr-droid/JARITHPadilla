import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navbar } from '../src/components/Navbar.tsx';

test('navigation omits the functional specification control', () => {
  const html = renderToStaticMarkup(React.createElement(Navbar, {
    currentUser: {
      id: 'user_inf_1',
      email: 'creador.scz@influconnect.demo',
      role: 'influencer',
      name: 'Creador Demo Santa Cruz',
      createdAt: '2026-09-01T10:00:00Z',
    },
    currentProfile: null,
    allUsers: [],
    onSwitchUser: () => undefined,
    notifications: [],
    onNotificationClick: () => undefined,
    onMarkAllRead: () => undefined,
    onResetDemo: () => undefined,
    activeTab: 'explore_campaigns',
    onTabChange: () => undefined,
  }));

  assert.doesNotMatch(html, /Especificación|especificación funcional/i);
});
