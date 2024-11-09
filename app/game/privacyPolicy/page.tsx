'use client'

import React from 'react'

import classes from './PrivacyPage.module.css'

export default function PrivacyPolicy() {
  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <h1>Privacy Policy</h1>
      </div>
      <div className={classes.guess}>
        <section>
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (username, email address)</li>
            <li>Game progress and scores</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our gaming service</li>
            <li>Track game progress and scores</li>
            <li>Improve our game experience</li>
            <li>Send important updates about the game</li>
          </ul>
        </section>

        <section>
          <h2>Data Storage and Security</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. Your data is stored securely and is only accessible to
            authorized personnel.
          </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our game and to store certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            Our game may contain links to third-party websites or services. We
            are not responsible for the privacy practices of these external
            sites or services.
          </p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for users under the age of 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>Changes to Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at: tom@financle.app
          </p>
        </section>
      </div>
    </div>
  )
}
