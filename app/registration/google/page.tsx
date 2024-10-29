'use client'

import { useState } from 'react'
import { FileButton, Button, TextInput, Avatar, Container } from '@mantine/core'
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
      username: '',
      id: id || '',
    },
    validate: (values) => {
      return {
        username:
          values.username.length > 2
            ? null
            : 'Username must be at least 3 characters',
        file: values.file === null ? 'Avatar is required' : null,
      }
    },
  })

  const handleRegister = async () => {
    if (form.validate().hasErrors) return

    setIsLoading(true)

    const { username, file } = form.values
    if (!file) {
      console.error('No file selected')
      return
    }

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('avatar', file)
      if (id !== null) formData.append('id', String(id))
      if (googleId !== null) formData.append('googleId', String(googleId))
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
      }

      const data = await response.json()
      console.log('Registration successful:', data)
      if (data.signedUrl) console.log(data.signedUrl)

      // Handle successful registration (e.g., redirect user)
      router.push('/')
      // You can add additional logic here if needed
    } catch (error) {
      console.error('Registration error:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    // Create a fetch request to get the image as a File object
    fetch(avatarUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'avatar.png', { type: 'image/png' })
        form.setFieldValue('file', file)
      })
      .catch((error) => console.error('Error loading avatar:', error))
  }

  return (
    <div className={classes.main}>
      <form className={classes.form}>
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Username"
          {...form.getInputProps('username')}
          className={classes.wideInput}
        />
        <div className={classes.avatarContainer}>
          <Avatar
            src={
              form.getInputProps('file').value
                ? URL.createObjectURL(form.getInputProps('file').value)
                : null
            }
            alt="Avatar preview"
            variant="filled"
            radius="xl"
            size="xl"
            onLoad={() => {
              if (form.getInputProps('file').value)
                URL.revokeObjectURL(form.getInputProps('file').value)
            }}
          />
          <FileButton
            accept="image/png,image/jpeg"
            onChange={(file: File | null) => {
              form.setFieldValue('file', file)
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
            selectedAvatar={
              form.values.file ? URL.createObjectURL(form.values.file) : null
            }
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
