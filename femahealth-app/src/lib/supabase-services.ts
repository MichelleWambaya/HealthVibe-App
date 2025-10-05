import { supabase, type Category, type Remedy, type UserFavorite, type UserPreferences } from './supabase'

// Error handling helper
function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  throw new Error(error.message || 'An error occurred')
}

// Category functions
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    handleSupabaseError(error)
    return null
  }
}

// Remedy functions
export const getAllRemedies = async (): Promise<Remedy[]> => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const getRemediesByCategory = async (categoryId: string): Promise<Remedy[]> => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .eq('category_id', categoryId)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const getRemedyById = async (id: string): Promise<Remedy | null> => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    handleSupabaseError(error)
    return null
  }
}

export const searchRemedies = async (query: string): Promise<Remedy[]> => {
  try {
    const searchTerm = `%${query.toLowerCase()}%`
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .or(`name.ilike.${searchTerm}, description.ilike.${searchTerm}`)
      .order('effectiveness', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const searchRemediesByIngredients = async (query: string): Promise<Remedy[]> => {
  try {
    const searchTerm = `%${query.toLowerCase()}%`
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .contains('ingredients', [query.toUpperCase()])
      .order('effectiveness', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

// User favorites functions
export const getUserFavorites = async (userId: string): Promise<UserFavorite[]> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const getBookmarkedRemedies = async (userId: string): Promise<Remedy[]> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        remedy_id,
        remedies (
          id,
          name,
          description,
          ingredients,
          instructions,
          preparation_time,
          relief_time,
          precautions,
          category_id,
          difficulty,
          effectiveness,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)

    if (error) throw error
    
    return data?.map(item => ({
      ...item.remedies,
      isBookmarked: true
    })) || []
  } catch (error) {
    handleSupabaseError(error)
    return []
  }
}

export const addToFavorites = async (userId: string, remedyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        remedy_id: remedyId
      })

    if (error) throw error
  } catch (error) {
    handleSupabaseError(error)
  }
}

export const removeFromFavorites = async (userId: string, remedyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('remedy_id', remedyId)

    if (error) throw error
  } catch (error) {
    handleSupabaseError(error)
  }
}

export const toggleBookmark = async (userId: string, remedyId: string): Promise<void> => {
  try {
    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('remedy_id', remedyId)
      .single()

    if (existing) {
      await removeFromFavorites(userId, remedyId)
    } else {
      await addToFavorites(userId, remedyId)
    }
  } catch (error) {
    handleSupabaseError(error)
  }
}

export const isBookmarked = async (userId: string, remedyId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('remedy_id', remedyId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return !!data
  } catch (error) {
    handleSupabaseError(error)
    return false
  }
}

// User preferences functions
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  } catch (error) {
    handleSupabaseError(error)
    return null
  }
}

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })

    if (error) throw error
  } catch (error) {
    handleSupabaseError(error)
  }
}
