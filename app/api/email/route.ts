import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendLoginCredentialsEmail, sendLoanDisbursementEmail } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, subject, html, name, email, password, role, borrowerName, loanAmount, repaymentSchedule } = body;
    
    if (type === 'login-credentials') {
      await sendLoginCredentialsEmail(to, name, email, password, role);
    } else if (type === 'loan-disbursement') {
      await sendLoanDisbursementEmail(to, borrowerName, loanAmount, repaymentSchedule);
    } else {
      await sendEmail(to, subject, html);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}


