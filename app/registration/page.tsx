'use client'

import { useState } from 'react'
import {
  Stepper,
  FileButton,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Avatar,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import classes from './ui/Page.module.css'

export default function Registration() {
  const [active, setActive] = useState(0)
  const form = useForm({
    initialValues: {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      avatar: null,
      avatarPreview: null,
      file: null as File | null,
      moto: '',
    },

    validate: (values) => {
      if (active === 0)
        return {
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
          confirmEmail:
            values.email !== values.confirmEmail
              ? 'Email does not match'
              : null,
          confirmPassword:
            values.password !== values.confirmPassword
              ? 'Password does not match'
              : null,
        }

      if (active === 1)
        return {
          moto:
            values.moto.length > 2
              ? null
              : 'Moto must be at least 3 characters',
          file: values.file === null ? 'Avatar is required' : null,
        }

      return {}
    },
  })

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) return current

      return current < 3 ? current + 1 : current
    })

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))

  return (
    <div className={classes.main}>
      <Stepper active={active} size="sm" onStepClick={setActive}>
        <Stepper.Step label="Account" description="Create an account">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
          <TextInput
            withAsterisk
            label="Confirm Email"
            placeholder="your@email.com"
            {...form.getInputProps('confirmEmail')}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Password"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            withAsterisk
            label="Confirm Password"
            placeholder="Password"
            {...form.getInputProps('confirmPassword')}
          />
        </Stepper.Step>
        <Stepper.Step label="Avatar" description="Add an avatar">
          <FileButton
            accept="image/png,image/jpeg"
            onChange={(file: File | null) => {
              form.setFieldValue('file', file)
            }}
          >
            {(props) => <Button {...props}>Upload avatar</Button>}
          </FileButton>

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
        </Stepper.Step>
      </Stepper>
      <Group justify="flex-end" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
      </Group>
    </div>
  )
}
