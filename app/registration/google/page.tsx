'use client'

import { useState } from 'react'
import {
  FileButton,
  Button,
  TextInput,
  Avatar,
  Container,
  Text,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { useUserContext } from '../../context/user/UserContext'
import { AvCarousel } from './components/avCarousel'
import classes from '../ui/Page.module.css'

export default function Registration() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUserContext()
  const id = user ? user.id : null
  const googleId = user ? user.googleId : null
  const form = useForm({
    initialValues: {
      file: null as File | null,
      avatarUrl: null as string | null,
      username: '',
      id: id || '',
    },
    validate: (values) => {
      return {
        username:
          values.username.length > 2
            ? null
            : 'Username must be at least 3 characters',
        file: !values.file && !values.avatarUrl ? 'Avatar is required' : null,
      }
    },
  })

  const handleRegister = async () => {
    if (form.validate().hasErrors) return

    setIsLoading(true)

    const { username, file, avatarUrl } = form.values
    if (!file && !avatarUrl) {
      console.error('No avatar selected')
      return
    }

    try {
      const formData = new FormData()
      formData.append('username', username)
      if (file) {
        formData.append('avatar', file)
        formData.append('avatarType', 'uploaded')
      } else if (avatarUrl) {
        formData.append('avatarUrl', avatarUrl)
        formData.append('avatarType', 'preset')
      }
      if (id !== null) formData.append('id', String(id))
      if (googleId !== null) formData.append('googleId', String(googleId))
      const clientDate = new Date().toISOString()
      formData.append('clientDate', clientDate)
      const response = await fetch('/registration/google/api', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error(
          'Registration error:',
          errorData.message || 'Registration failed'
        )
        return
      }

      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    form.setValues({
      ...form.values,
      file: null,
      avatarUrl,
    })
  }

  const getAvatarSrc = () => {
    if (form.values.file) return URL.createObjectURL(form.values.file)

    return form.values.avatarUrl || null
  }

  return (
    <div className={classes.main}>
      <Text size="md" ta="center" fw={500}>
        We encourage users to use their Twitter avatar and username.
      </Text>
      <form className={classes.form}>
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Username"
          {...form.getInputProps('username')}
          className={classes.wideInput}
        />
        <Text size="md" ta="center" fw={500}>
          Select an avatar from the carousel or upload your own
        </Text>
        <div className={classes.avatarContainer}>
          <Avatar
            src={getAvatarSrc()}
            alt="Avatar preview"
            variant="filled"
            radius="xl"
            size="xl"
            onLoad={() => {
              if (form.values.file)
                URL.revokeObjectURL(URL.createObjectURL(form.values.file))
            }}
          />
          <FileButton
            accept="image/png,image/jpeg"
            onChange={(file: File | null) => {
              form.setValues({
                ...form.values,
                file,
                avatarUrl: null,
              })
            }}
          >
            {(props) => (
              <Button {...props}>
                {form.values.file ? 'Choose Different File' : 'Upload avatar'}
              </Button>
            )}
          </FileButton>
        </div>
        <Container fluid w="100%">
          <AvCarousel
            onSelectAvatar={handleAvatarSelect}
            selectedAvatar={form.values.avatarUrl}
          />
        </Container>
      </form>

      <div className={classes.navigationButtons}>
        <Button
          onClick={handleRegister}
          loading={isLoading}
          variant="filled"
          size="md"
          radius="xl"
          loaderProps={{ type: 'bars' }}
        >
          Register
        </Button>
      </div>
    </div>
  )
}
