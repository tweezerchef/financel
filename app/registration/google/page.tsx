'use client'

import { useState } from 'react'
import { FileButton, Button, TextInput, Avatar } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { useUserContext } from '../../context/user/UserContext'
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

  return (
    <div className={classes.main}>
      <div className={classes.contentContainer}>
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
              {(props) => <Button {...props}>Upload avatar</Button>}
            </FileButton>
          </div>
        </form>
      </div>
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
