import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import * as postmark from 'postmark';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmailService {
  private postmarkClient: postmark.ServerClient | null = null;

  constructor(private readonly prisma: PrismaService) {
    const apiToken = process.env.POSTMARK_API_TOKEN;

    if (apiToken) {
      this.postmarkClient = new postmark.ServerClient(apiToken);
    } else {
      console.log('Slanje e-mailova je onemoguceno jer nema API tokena.');
      this.postmarkClient = null;
    }
  }

  async sendEmail(emails: string[], text: string, subject: string) {
    if (!this.postmarkClient) {
      console.log('Email nije poslan jer je slanje onemoguceno.');
      return;
    }

    const interns = await this.prisma.intern.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        interviewStatus: true,
        internDisciplines: {
          select: {
            discipline: true,
            priority: true,
            status: true,
          },
        },
        interviewSlot: {
          select: {
            start: true,
            end: true,
            score: true,
          },
        },
      },
    });

    const template = nunjucks.compile(text);

    return Promise.all(
      interns.map((intern) => {
        return this.postmarkClient.sendEmail({
          From: 'info@dump.hr',
          To: String(intern.email),
          Subject: subject,
          TextBody: template.render({ intern }),
          MessageStream: 'outbound',
        });
      }),
    );
  }

  async makeEmail(emails: string[], text: string) {
    const interns = await this.prisma.intern.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        interviewStatus: true,
        internDisciplines: {
          select: {
            discipline: true,
            priority: true,
            status: true,
          },
        },
        interviewSlot: {
          select: {
            start: true,
            end: true,
            score: true,
          },
        },
      },
    });

    const template = nunjucks.compile(text);

    return interns.map((intern) => template.render({ intern }));
  }
}
