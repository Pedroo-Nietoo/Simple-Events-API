import { Injectable } from '@nestjs/common';
import { User, Event } from '@prisma/client';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {}

  async sendRegistrationEmail(user: User, event: Event) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const dateStart = new Date(event.dateStart);

      const combinedDate = new Date(
        dateStart.getUTCFullYear(),
        dateStart.getUTCMonth(),
        dateStart.getUTCDate(),
        dateStart.getUTCHours(),
        dateStart.getUTCMinutes(),
      );

      const day = String(combinedDate.getDate()).padStart(2, '0');
      const month = String(combinedDate.getMonth() + 1).padStart(2, '0');
      const year = combinedDate.getFullYear();
      const hours = String(combinedDate.getHours()).padStart(2, '0');
      const minutes = String(combinedDate.getMinutes()).padStart(2, '0');

      const formattedDate = `${day}/${month}/${year}, às ${hours}:${minutes}`;

      const msg = {
        to: user?.email,
        from: 'pedronieto.2005@gmail.com',
        templateId: 'd-d09f68831f8c4c688a5a3dbb19e7fca0',
        dynamic_template_data: {
          title: event?.title,
          details: event?.details,
          date: formattedDate,
        },
        //   // subject: 'Event Registration Confirmation',
        //   // text: `You have successfully registered for the event with ID: ${eventId}`,
        //   // html: `<strong>You have successfully registered for the event with ID: ${eventId}</strong>`,
        // };
      };
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send registration confirmation email');
    }
  }
}
