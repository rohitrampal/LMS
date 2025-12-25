# Loan Management System (LMS) - SaaS Application

A comprehensive Loan Management System built with Next.js, TypeScript, Material-UI, and Zustand for state management.

## Features

### User Roles
- **Super Admin**: Full system access, manages admins, regulators, and banks
- **Admin**: Manages regulators and banks
- **Bank Admin**: Manages bank employees, accounts, loans, and loan products
- **Bank Employee**: Handles loan applications, disbursements, and adjustments based on permissions
- **Regulator**: View-only access to all banks, loans, and accounts for regulatory oversight

### Core Modules

1. **Dashboard**: Role-based dashboards with analytics and graphs
2. **Banks Management**: CRUD operations for banks
3. **Bank Employees**: Manage employees with ABAC permissions
4. **Accounts**: Manage borrower bank accounts
5. **Loan Categories**: Define loan categories
6. **Loan Products**: Create and manage loan products with interest rates
7. **Loan Applications**: Submit and approve loan applications
8. **Loan Application Requests**: Request-based loan workflow
9. **Loan Disbursements**: Disburse approved loans with repayment schedules
10. **Loan Adjustments**: Handle adjustments, waivers, and settlements
11. **Reports**: Generate and export reports
12. **Analytics**: View system-wide analytics and trends

### Key Features

- ✅ Role-based access control (RBAC) with permissions
- ✅ Persistent data storage using Zustand with localStorage
- ✅ Email notifications (configured for yopmail.com testing)
- ✅ Responsive, mobile-first design
- ✅ Enterprise-grade UI with Material-UI
- ✅ Real-time analytics and charts
- ✅ Loan disbursement with automatic repayment schedule generation
- ✅ Comprehensive CRUD operations for all modules

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd loan
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

NEXT_PUBLIC_APP_NAME=Loan Management System
NEXT_PUBLIC_APP_URL=http://localhost:3000

EMAIL_SERVICE_ENABLED=true
```

**Note**: For testing with yopmail.com, you can leave SMTP credentials empty. Emails will be logged to the console.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

The system comes pre-loaded with demo users:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@yopmail.com | admin123 |
| Admin | admin@yopmail.com | admin123 |
| Bank Admin | bankadmin@yopmail.com | admin123 |
| Bank Employee | bankemployee@yopmail.com | admin123 |
| Regulator | regulator@yopmail.com | admin123 |

**Note**: All emails use `@yopmail.com` for easy email testing. Check yopmail.com for received emails.

## Project Structure

```
loan/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── banks/             # Banks management
│   ├── bank-employees/    # Employee management
│   ├── accounts/          # Account management
│   ├── loan-categories/   # Loan categories
│   ├── loan-products/     # Loan products
│   ├── loan-applications/ # Loan applications
│   ├── loan-disbursements/# Disbursements
│   ├── loan-adjustments/  # Adjustments
│   └── ...
├── components/            # React components
│   ├── Layout/           # Navbar, Sidebar
│   └── Dashboard/        # Dashboard components
├── store/                # Zustand store
├── types/                # TypeScript types
├── utils/                # Utility functions
├── theme/                # MUI theme
└── public/               # Static files
```

## Key Workflows

### Loan Application Flow
1. Bank Employee creates a loan application request
2. Head Manager or Bank Admin approves the request
3. Approved request becomes a loan application
4. Bank Admin/Employee approves the loan application
5. Bank Employee disburses the approved loan
6. System generates repayment schedule
7. Email notification sent to borrower

### Loan Disbursement
- Automatically creates repayment schedule
- Updates borrower account balance
- Sends email notification with schedule
- Records disbursement transaction

### Loan Adjustments
- Penalty waivers
- Overpayment adjustments
- Partial settlements
- Interest recalculations
- Early loan closures

## Technologies Used

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Material-UI (MUI)**: UI components
- **Zustand**: State management with persistence
- **Recharts**: Charts and graphs
- **Nodemailer**: Email sending
- **date-fns**: Date utilities
- **React Hook Form**: Form handling

## Development

### Build for Production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Features in Detail

### Dashboard Analytics
- **Super Admin**: Total banks, employees, active/inactive banks, growth trends
- **Bank Admin**: Employees, customers, loans, growth charts with filters
- **Admin**: Banks and regulators overview
- **Regulator**: Banks, loans, and accounts overview
- **Bank Employee**: Accounts, loans, and disbursements overview

### Permissions System
Bank employees can have granular permissions:
- `loan_applications`
- `loan_disbursements`
- `loan_adjustments`
- `accounts`
- `loan_categories`
- `loan_products`

### Email Integration
- Login credentials sent on user creation
- Loan disbursement confirmations with repayment schedules
- Uses yopmail.com for easy testing (check yopmail.com for emails)

## Future Enhancements

- [ ] Loan transfer between banks
- [ ] Advanced reporting and exports (PDF/CSV)
- [ ] SMS notifications
- [ ] Document upload and management
- [ ] Payment tracking and reminders
- [ ] Advanced search and filters
- [ ] Audit logs
- [ ] Multi-language support

## License

This project is for demonstration purposes.

## Support

For issues or questions, please open an issue in the repository.


