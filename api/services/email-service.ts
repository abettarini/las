import { Resend } from 'resend'
import type { UserData } from './user-service.js'

interface EmailServiceEnv {
  RESEND_API_KEY: string
  RESEND_FROM_EMAIL: string
  RESEND_FROM_NAME: string
}

export async function sendVerificationEmail(
  user: UserData,
  baseUrl: string,
  env: EmailServiceEnv
): Promise<boolean> {
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const verificationUrl = `${baseUrl}/verifica-email?token=${user.verificationToken}`

    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Verifica il tuo indirizzo email</h1></div>
            <div class="content">
              <p>Ciao,</p>
              <p>Grazie per esserti registrato. Per completare la registrazione, devi verificare il tuo indirizzo email.</p>
              <p>Clicca sul pulsante qui sotto per verificare il tuo indirizzo email:</p>
              <p style="text-align: center;"><a href="${verificationUrl}" class="button">Verifica Email</a></p>
              <p>Oppure copia e incolla il seguente link nel tuo browser:</p>
              <p>${verificationUrl}</p>
              <p>Questo link scadrà tra 24 ore.</p>
              <p>Se non hai richiesto questa email, puoi ignorarla.</p>
            </div>
            <div class="footer">
              <p>Questo è un messaggio automatico, si prega di non rispondere.</p>
              <p>TSN Lastra a Signa - Via del Poligono, 1 - 50055 Lastra a Signa (FI)</p>
            </div>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
      to: [user.email],
      subject: '[VERIFICA EMAIL]Verifica il tuo indirizzo email - TSN Lastra a Signa',
      html: emailHtml,
    })

    if (error) { console.error('Errore email verifica:', error); return false }
    return true
  } catch (error) {
    console.error('Errore email verifica:', error)
    return false
  }
}

export async function sendAuthenticationEmail(
  user: UserData,
  token: string,
  baseUrl: string,
  env: EmailServiceEnv
): Promise<boolean> {
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const authUrl = `${baseUrl}/autenticazione?token=${token}`

    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Accedi al tuo account</h1></div>
            <div class="content">
              <p>Ciao,</p>
              <p>Abbiamo ricevuto una richiesta di accesso al tuo account. Clicca sul pulsante qui sotto per accedere:</p>
              <p style="text-align: center;"><a href="${authUrl}" class="button">Accedi</a></p>
              <p>Oppure copia e incolla il seguente link nel tuo browser:</p>
              <p>${authUrl}</p>
              <p>Questo link scadrà tra 7 giorni.</p>
              <p>Se non hai richiesto questa email, qualcuno potrebbe aver inserito il tuo indirizzo email per errore. Puoi ignorare questa email.</p>
            </div>
            <div class="footer">
              <p>Questo è un messaggio automatico, si prega di non rispondere.</p>
              <p>TSN Lastra a Signa - Via del Poligono, 1 - 50055 Lastra a Signa (FI)</p>
            </div>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
      to: [user.email],
      subject: '[AUTENTICAZIONE] Accedi al tuo account - TSN Lastra a Signa',
      html: emailHtml,
    })

    if (error) { console.error('Errore email autenticazione:', error); return false }
    return true
  } catch (error) {
    console.error('Errore email autenticazione:', error)
    return false
  }
}
