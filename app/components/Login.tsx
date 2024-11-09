'use client'

import { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Paper,
  Center,
  PaperProps,
  Button,
  Divider,
  Stack,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { RegisterButton } from './buttons/RegisterButton'
import classes from './ui/Login.module.css'
import { useUserContext } from '../context/user/UserContext'
import { GoogleButton } from './buttons/GoogleButton'

export interface LoginProps extends PaperProps {
  onAuthStart: () => void
  isAuthenticating?: boolean
}

type FormProps = {
  email: string
  username?: string
  password: string
}

export function Login({
  onAuthStart,
  isAuthenticating = false,
  ...props
}: LoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUserContext()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      terms: true,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  })

  const formSubmit = async (values: FormProps) => {
    setIsLoading(true)
    onAuthStart()
    const { email, password } = values
    const now = new Date()
    // Get start of day for dateOnly
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    try {
      const response = await fetch('auth/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          dateOnly: dateOnly.toISOString(),
        }),
        credentials: 'include',
      })
      const data = await response.json()

      if (response.ok) {
        setUser({
          id: data.id,
          type: data.type,
          resultId: data.resultId,
          nextCategory: data.nextCategory,
          signedAvatarUrl: data.signedAvatarUrl,
          signedAvatarExpiration: data.signedAvatarExpiration,
          username: data.username,
          avatarUrl: data.avatarUrl,
        })
        router.push('/game')
      } else {
        console.error('Login failed:', data.message)
        alert(data.message)
        onAuthStart() // Turn off loading state on error
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login.')
      onAuthStart() // Turn off loading state on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper p="xs" {...props} className={classes.login}>
      <Center mt="xs">
        <RegisterButton disabled={isAuthenticating || isLoading} />
      </Center>

      <Divider label="Or continue with email" labelPosition="center" my="md" />
      <Center>
        <GoogleButton
          onAuthStart={onAuthStart}
          disabled={isAuthenticating || isLoading}
        />
      </Center>

      <form onSubmit={form.onSubmit((values) => formSubmit(values))}>
        <Stack gap="xs">
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid email'}
            radius="md"
            disabled={isAuthenticating || isLoading}
            size="sm"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
            radius="md"
            disabled={isAuthenticating || isLoading}
            size="sm"
          />
        </Stack>

        <Center mt="md">
          <Button
            type="submit"
            radius="xl"
            disabled={isAuthenticating || isLoading}
            size="sm"
          >
            Login
          </Button>
        </Center>
      </form>
    </Paper>
  )
}
