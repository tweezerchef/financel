'use client'

import { useState } from 'react'
import {
  FileButton,
  Button,
  TextInput,
  PasswordInput,
  Avatar,
  Container,
  Text,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { AvCarousel } from './google/components/avCarousel'
import classes from './ui/Registration.Page.module.css'

export default function Registration() {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    initialValues: {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      file: null as File | null,
      avatarUrl: null as string | null,
      username: '',
    },

    validate: (values) => {
      if (active === 0)
        return {
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
          confirmEmail:
            values.email !== values.confirmEmail
              ? 'Email does not match'
              : null,
          password:
            values.password.length < 6
              ? 'Password must be at least 6 characters'
              : null,
          confirmPassword:
            values.password !== values.confirmPassword
              ? 'Password does not match'
              : null,
        }

      if (active === 1)
        return {
          username:
            values.username.length > 2
              ? null
              : 'Username must be at least 3 characters',
          file: !values.file && !values.avatarUrl ? 'Avatar is required' : null,
        }

      return {}
    },
  })

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) return current

      return current < 1 ? current + 1 : current
    })

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))

  const handleAvatarSelect = (avatarUrl: string) => {
    form.setValues({
      ...form.values,
      file: null,
      avatarUrl,
    })
  }

  const handleRegister = async () => {
    if (form.validate().hasErrors) return

    setIsLoading(true)

    const { email, password, username, file, avatarUrl } = form.values
    if (!file && !avatarUrl) {
      console.error('No avatar selected')
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('username', username)

      if (file) {
        formData.append('avatar', file)
        formData.append('avatarType', 'uploaded')
      } else if (avatarUrl) {
        formData.append('avatarUrl', avatarUrl)
        formData.append('avatarType', 'preset')
      }

      const response = await fetch('registration/api', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Registration failed')

      router.push('/')
    } catch (error) {
      console.error(
        'Registration error:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getAvatarSrc = () => {
    if (form.values.file) return URL.createObjectURL(form.values.file)

    return form.values.avatarUrl || null
  }

  return (
    <div className={classes.main}>
      {active === 0 ? (
        <div className={classes.contentContainer}>
          <form className={classes.form}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
              className={classes.wideInput}
            />
            <TextInput
              withAsterisk
              label="Confirm Email"
              placeholder="your@email.com"
              {...form.getInputProps('confirmEmail')}
              className={classes.wideInput}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              {...form.getInputProps('password')}
              className={classes.wideInput}
            />
            <PasswordInput
              withAsterisk
              label="Confirm Password"
              placeholder="Password"
              {...form.getInputProps('confirmPassword')}
              className={classes.wideInput}
            />
          </form>
        </div>
      ) : (
        <>
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
            <Text size="md" mb="xl" ta="center" fw={500} c="dimmed">
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
                    {form.values.file
                      ? 'Choose Different File'
                      : 'Upload avatar'}
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
        </>
      )}
      <div className={classes.navigationButtons}>
        {active !== 0 && (
          <Button variant="filled" size="md" radius="xl" onClick={prevStep}>
            Back
          </Button>
        )}
        {active === 0 ? (
          <Button variant="filled" size="md" radius="xl" onClick={nextStep}>
            Next step
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  )
}
