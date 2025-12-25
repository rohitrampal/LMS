# Quick Start Guide

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - For testing with yopmail.com, you can leave SMTP settings empty
   - Emails will be logged to console for development

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Login with demo credentials (see below)

## Demo Credentials

All passwords are: `admin123`

- **Super Admin**: superadmin@yopmail.com
- **Admin**: admin@yopmail.com  
- **Bank Admin**: bankadmin@yopmail.com
- **Bank Employee**: bankemployee@yopmail.com
- **Regulator**: regulator@yopmail.com

## Testing Email Functionality

1. Sign up a new user or create a bank employee
2. Check emails at: https://yopmail.com
3. Enter the email address (e.g., `superadmin@yopmail.com`)
4. View received emails

## Key Features to Test

### Super Admin Flow
1. Login as superadmin@yopmail.com
2. View dashboard with analytics
3. Create banks, admins, regulators
4. View all system data

### Bank Admin Flow
1. Login as bankadmin@yopmail.com
2. Create bank employees
3. Create loan products
4. Create accounts
5. Approve loan applications

### Bank Employee Flow
1. Login as bankemployee@yopmail.com
2. Create loan application requests
3. Create loan applications
4. Process loan disbursements
5. Handle loan adjustments

### Loan Disbursement Flow
1. Create a loan application
2. Approve the application
3. Disburse the loan
4. Check email for repayment schedule (at yopmail.com)

## Data Persistence

- All data is stored in browser's localStorage
- Data persists across page refreshes
- To reset: Clear browser localStorage or use incognito mode

## Troubleshooting

### Email Not Sending?
- Check console logs (emails are logged there for development)
- Verify SMTP settings in `.env.local` if using real email
- For testing, use yopmail.com addresses

### Data Not Persisting?
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing localStorage and reloading

### Build Errors?
- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall
- Check Node.js version (requires 18+)

## Next Steps

1. Customize the theme in `theme/theme.ts`
2. Configure real SMTP for production emails
3. Add more loan products and categories
4. Test all CRUD operations
5. Explore analytics and reports


