/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { Button, Image } from '@mantine/core'

interface AvatarUploadProps {
  email: string
}

export function AvatarUpload({ email }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)

    try {
      const response = await fetch('/api/aws/uploadAvi', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setAvatarUrl(data.url)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload">
        <Button component="span">Upload Avatar</Button>
      </label>
      {avatarUrl && (
        <Image src={avatarUrl} alt="Avatar" width={100} height={100} />
      )}
    </div>
  )
}
