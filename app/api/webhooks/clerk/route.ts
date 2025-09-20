import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { api } from '@/convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data

    try {
      await convex.mutation(api.users.store, {
        userId: id,
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        email: email_addresses[0]?.email_address || '',
        image_url: image_url || undefined,
      })
    } catch (error) {
      console.error('Error storing user in Convex:', error)
      return new Response('Error storing user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await convex.mutation(api.users.remove, {
        userId: id!,
      })
    } catch (error) {
      console.error('Error removing user from Convex:', error)
      return new Response('Error removing user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}