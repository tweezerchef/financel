import React from 'react'
import classes from './ui/SecurityPage.module.css'

export default function SecurityPolicy() {
  return (
    <>
      <div className={classes.dayOf}>
        <h1>Security Policy</h1>
      </div>
      <div className={classes.guess}>
        <section>
          <h2>Data Protection</h2>
          <p>
            We implement industry-standard security measures to protect your
            data, including:
          </p>
          <ul>
            <li>End-to-end encryption for sensitive data</li>
            <li>Secure password hashing</li>
            <li>Regular security audits and updates</li>
            <li>Protected database access</li>
          </ul>
        </section>

        <section>
          <h2>Account Security</h2>
          <p>To ensure the security of your account, we:</p>
          <ul>
            <li>Require strong passwords</li>
            <li>Monitor for suspicious activity</li>
            <li>Implement rate limiting on login attempts</li>
            <li>Provide secure password reset procedures</li>
          </ul>
        </section>

        <section>
          <h2>Data Storage</h2>
          <p>
            Your data is stored securely in encrypted databases. We regularly
            backup all data and maintain strict access controls to prevent
            unauthorized access.
          </p>
        </section>

        <section>
          <h2>Security Measures</h2>
          <p>Our application employs multiple layers of security:</p>
          <ul>
            <li>SSL/TLS encryption for all data transfers</li>
            <li>Regular vulnerability assessments</li>
            <li>Automated threat detection</li>
            <li>Secure session management</li>
          </ul>
        </section>

        <section>
          <h2>Incident Response</h2>
          <p>
            In the event of a security incident, we have procedures in place to:
          </p>
          <ul>
            <li>Immediately investigate and contain the incident</li>
            <li>Notify affected users promptly</li>
            <li>Work with security experts to resolve issues</li>
            <li>Implement measures to prevent future incidents</li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Security</h2>
          <p>
            We carefully vet all third-party services and ensure they maintain
            the same high security standards we do. Regular audits are conducted
            to verify compliance.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you discover a security vulnerability or have security concerns,
            please contact our security team immediately at: tom@financle.app
          </p>
        </section>
      </div>
    </>
  )
}
