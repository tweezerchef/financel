'use client'

import { useState } from 'react'
import { useToggle, upperFirst } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { GoogleButton } from './buttons/GoogleButton'
import { TwitterButton } from './buttons/TwitterButton'
import classes from './ui/Login.module.css'

type FormProps = {
  email: string
  username?: string
  password: string
}

export function Login(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register'])
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
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
    if (isLoggingIn) return
    setIsLoggingIn(true)

    try {
      const { email, password } = values
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }

      const response = await fetch('auth/api/login', requestOptions)

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const user = await response.json()
        if (user.token) {
          localStorage.setItem('token', user.token)
          router.push('/game')
        } else console.error('Login failed: No token received')
      } else console.error('Received non-JSON response from server')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }
  return (
    <Paper p="md" {...props} className={classes.login}>
      <Text size="lg" fw={500}>
        To truly compete, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit((values) => formSubmit(values))}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Username"
              placeholder="Your Username"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue('username', event.currentTarget.value)
              }
              radius="md"
            />
          )}

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
          />
        </Stack>

        <Group mt="xl" gap="xs">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}
