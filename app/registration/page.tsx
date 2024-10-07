'use client'

import { useState } from 'react'
import {
  Stepper,
  FileButton,
  Button,
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
      file: null as File | null,
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
          file: values.file === null ? 'Avatar is required' : null,
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
  const handleRegister = () => {
    if (form.validate().hasErrors) return
    console.log('Form values:', form.values)
  }

  return (
    <div className={classes.main}>
      <div>
        <Stepper
          active={active}
          size="xs"
          onStepClick={setActive}
          styles={{
            separator: {
              width: '0px',
              margin: '0',
              padding: '0',
              justifySelf: 'flex-start',
            },
          }}
        >
          <Stepper.Step label="Account">
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
          </Stepper.Step>

          <Stepper.Step label="Avatar">
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
          </Stepper.Step>
        </Stepper>
      </div>

      <div className={classes.navigationButtons}>
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active === 0 ? (
          <Button onClick={nextStep}>Next step</Button>
        ) : (
          <Button onClick={handleRegister}>Register</Button>
        )}
      </div>
    </div>
  )
}
