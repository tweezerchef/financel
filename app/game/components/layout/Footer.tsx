/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { MouseEvent } from 'react'
import { Container, Group, Anchor } from '@mantine/core'
import Image from 'next/image'

import classes from './ui/Footer.module.css'

const links = [
  { link: '#', label: 'Contact' },
  { link: '/game/privacyPolicy', label: 'Privacy' },
  { link: '#', label: 'Blog' },
  { link: '/game/security', label: 'Security' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (link.link === '#') event.preventDefault()
      }}
      size="xs"
    >
      {link.label}
    </Anchor>
  ))

  return (
    <div className={classes.footer}>
      <Container className={classes.inner} fluid>
        <Image src="/favicon.png" alt="Logo" width={30} height={30} />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  )
}
