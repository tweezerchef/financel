'use client'

import { Group, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import classes from './ui/Navbar.module.css'

export function Navbar() {
  const [opened, { toggle }] = useDisclosure()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault() // Prevent default action for space key
      toggle()
    }
  }

  return (
    <div className={classes.navbarContainer}>
      <div
        className={classes.logoContainer}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={opened}
        aria-label="Toggle navigation menu"
      >
        <Image
          src="/favicon.png" // Replace with the actual logo source
          alt="Financel Logo"
          width={50} // Set the appropriate width
          height={50} // Set the appropriate height
        />
        <span className={classes.title}>Financel</span>
      </div>
      <Group
        className={opened ? classes.menuVisible : classes.menuHidden}
        style={{
          flexDirection: 'column',
        }}
      >
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </Group>
    </div>
  )
}
