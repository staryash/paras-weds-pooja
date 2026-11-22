/* ------------------------------------------------------------------
   Everything you may need to edit lives here.
   ------------------------------------------------------------------ */
window.WEDDING_CONFIG = {
  // 1) Paste your Google Apps Script "Web app" URL (ends with /exec).
  //    Until this is filled in, the form runs in demo mode and saves nothing.
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbxKSWRG6H9yD9MIeKI1joWkPwZPErhtDikrW0aydCIMn_IyZ6ZsBfOuLKnyBmy2DqOkiQ/exec',

  // 2) Map links. These are Google Maps searches that open the Maps app on phones.
  //    For an exact pin: open the place in Google Maps → Share → Copy link,
  //    and paste that link (https://maps.app.goo.gl/...) in place of the search URL.
  venues: {
    ananya:       'https://www.google.com/maps/search/?api=1&query=Hotel+Ananya+Regency%2C+Ramnagar+Road%2C+Kashipur%2C+Uttarakhand',
    residence:    'https://www.google.com/maps/search/?api=1&query=R.K.+Hospital%2C+Ramnagar+Road%2C+Kashipur%2C+Uttarakhand',
    sapphire:     'https://www.google.com/maps/search/?api=1&query=Sapphire+Hotel%2C+Haldwani%2C+Uttarakhand',
    vintageGreen: 'https://www.google.com/maps/search/?api=1&query=Vintage+Green%2C+Haldwani%2C+Uttarakhand'
  },

  // 3) Ask guests to reply by this date (shown on the reply card and the reminder bar).
  replyBy: '2026-11-30',

  // Wedding day, for the "N days to go" line.
  weddingDate: '2026-12-04',

  // Public URL of the site (used for the share button & calendar details).
  siteUrl: 'https://staryash.github.io/paras-weds-pooja/'
};
