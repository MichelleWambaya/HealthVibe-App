import { supabase } from './supabase'

export interface ProfileImageUpload {
  file: File
  userId: string
}

export interface ProfileImageResponse {
  success: boolean
  url?: string
  error?: string
}

export class ProfileImageService {
  private static readonly BUCKET_NAME = 'profile-images'
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file selected' }
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size must be less than 5MB' }
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
    }

    return { isValid: true }
  }

  static async uploadProfileImage({ file, userId }: ProfileImageUpload): Promise<ProfileImageResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: fileName,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return { success: false, error: 'Failed to update profile' }
      }

      return { 
        success: true, 
        url: urlData.publicUrl 
      }

    } catch (error) {
      console.error('Profile image upload error:', error)
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    }
  }

  static async deleteProfileImage(userId: string): Promise<ProfileImageResponse> {
    try {
      // Get current avatar filename
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single()

      if (profile?.avatar_url) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove([`${userId}/${profile.avatar_url}`])

        if (deleteError) {
          console.error('Delete error:', deleteError)
        }
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        return { success: false, error: 'Failed to remove profile image' }
      }

      return { success: true }

    } catch (error) {
      console.error('Profile image delete error:', error)
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    }
  }

  static getProfileImageUrl(userId: string, fileName?: string): string | null {
    if (!fileName) return null
    
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(`${userId}/${fileName}`)
    
    return data.publicUrl
  }
}
