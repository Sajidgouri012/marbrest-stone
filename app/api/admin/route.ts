import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, table, data, id } = body

    const supabase = createAdminClient()

    // Strip out relation/joined fields that aren't actual columns
    const cleanData = data ? { ...data } : data
    if (cleanData) {
      delete cleanData.stone_type
      delete cleanData.id
      delete cleanData.created_at
      delete cleanData.updated_at
    }

    let result

    switch (action) {
      case 'insert':
        result = await supabase.from(table).insert([cleanData]).select()
        break
      case 'update':
        result = await supabase.from(table).update(cleanData).eq('id', id).select()
        break
      case 'delete':
        result = await supabase.from(table).delete().eq('id', id)
        break
      case 'fetch':
        if (table === 'products') {
          result = await supabase
            .from(table)
            .select('*, stone_type:stone_types(name)')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
        } else if (table === 'stone_types') {
          result = await supabase
            .from(table)
            .select('*')
            .order('display_order', { ascending: true })
        } else {
          result = await supabase
            .from(table)
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
        }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (result.error) {
      console.error(`Admin API error [${action} ${table}]:`, result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
