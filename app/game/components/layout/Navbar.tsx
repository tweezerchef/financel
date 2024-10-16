'use client'

import { Group, UnstyledButton, Avatar } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import { useUserContext } from '../../../context/user/UserContext'
import classes from './ui/Navbar.module.css'

export function Navbar() {
  const [opened, { toggle }] = useDisclosure()
  const { user } = useUserContext()
  const avatarUrl = user?.signedAvatarUrl
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
          src="/favicon.svg" // Replace with the actual logo source
          alt="Financel Logo"
          width={120} // Set the appropriate width
          height={120} // Set the appropriate height
          quality={70}
          priority
        />
      </div>
      <div className={classes.titleContainer}>
        <span className={classes.title}>Financle</span>
      </div>
      {avatarUrl && <Avatar src={avatarUrl} size={32} radius="xl" />}
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
