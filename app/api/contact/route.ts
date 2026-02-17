import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Email notification function - ready for email service integration
async function sendEmailNotification(inquiry: any) {
  // TODO: Integrate email service when package is purchased
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@marbreststone.com',
  //   to: process.env.ADMIN_EMAIL || 'admin@marbreststone.com',
  //   subject: `New Inquiry from ${inquiry.name}`,
  //   html: `
  //     <h2>New Contact Inquiry</h2>
  //     <p><strong>Name:</strong> ${inquiry.name}</p>
  //     <p><strong>Email:</strong> ${inquiry.email}</p>
  //     <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
  //     <p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p>
  //     <p><strong>Project Type:</strong> ${inquiry.project_type || 'N/A'}</p>
  //     <p><strong>Budget:</strong> ${inquiry.budget || 'N/A'}</p>
  //     <p><strong>Message:</strong> ${inquiry.message}</p>
  //   `
  // })
  
  console.log('Email notification ready - configure email service to enable')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, projectType, budget, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, phone, and message are required' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const phoneDigits = phone.replace(/[\s\-+()]/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 15 || !/^\d+$/.test(phoneDigits)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Save to database
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([{
        name,
        email,
        phone: phone || null,
        company: company || null,
        project_type: projectType || null,
        budget: budget || null,
        message,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to save inquiry' },
        { status: 500 }
      )
    }

    // Send email notification (when configured)
    try {
      await sendEmailNotification(data)
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email fails
    }

    console.log('Contact inquiry saved:', data.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your inquiry! We will contact you soon.' 
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
