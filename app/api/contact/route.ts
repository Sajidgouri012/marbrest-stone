import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, projectType, budget, message } = body

    console.log('Contact form submission:', {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
