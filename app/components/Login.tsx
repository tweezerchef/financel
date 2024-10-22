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

type FormProps = {
  email: string
  username?: string
  password: string
}

export function Login(props: PaperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUserContext()
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
    setIsLoading(true)
    const { email, password } = values
    try {
      const response = await fetch('auth/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // This is important to include cookies
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
        })
        router.push('/game')
      } else {
        console.error('Login failed:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Paper p="md" {...props} className={classes.login}>
      <Center mt="sm">
        <RegisterButton />
      </Center>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />
      <Center>
        <GoogleButton />
      </Center>

      <form onSubmit={form.onSubmit((values) => formSubmit(values))}>
        <Stack>
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

        <Center mt="xl">
          <Button type="submit" radius="xl" disabled={isLoading}>
            Login
          </Button>
        </Center>
      </form>
    </Paper>
  )
}
