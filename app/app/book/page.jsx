'use client';

import React from 'react';

export default function Page() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ minWidth: '320px', height: '700px', width: '100%' }}>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/admin-oursocialimage/30min?hide_gdpr_banner=1"
          style={{ minWidth: '320px', height: '100%' }}
        ></div>
      </div>

      <script
        type="text/javascript"
        src="https://assets.calendly.com/assets/external/widget.js"
        async
      ></script>
    </main>
  );
}
