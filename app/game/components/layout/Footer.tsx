/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { MouseEvent } from 'react'
import { Container, Group, Anchor } from '@mantine/core'
import Image from 'next/image'

import classes from './ui/Footer.module.css'

const links = [
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Blog' },
  { link: '#', label: 'Careers' },
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
      onClick={(event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()}
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
