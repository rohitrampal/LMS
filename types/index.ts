export type UserRole = 'superadmin' | 'admin' | 'bank' | 'regulator' | 'bank_employee';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  bankId?: string;
  bankName?: string;
  permissions?: string[];
  roleText?: string; // e.g., "manager", "accountant"
  isActive: boolean;
  createdAt: string;
}

export interface Bank {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  registrationNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface BankEmployee {
  id: string;
  name: string;
  email: string;
  password: string;
  bankId: string;
  bankName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  borrowerName: string;
  accountNumber: string;
  bankId: string;
  bankName: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface LoanCategory {
  id: string;
  name: string;
  description: string;
  bankId?: string;
  createdAt: string;
}

export interface LoanProduct {
  id: string;
  productCode: string;
  name: string;
  interestRate: number;
  loanCategoryId: string;
  loanCategoryName: string;
  bankId?: string;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
  createdAt: string;
}

export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'closed' | 'transferred';

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  accountId: string;
  borrowerName: string;
  accountNumber: string;
  loanProductId: string;
  loanProductName: string;
  loanCategoryId: string;
  loanCategoryName: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  status: LoanStatus;
  bankId: string;
  bankName: string;
  appliedBy: string;
  approvedBy?: string;
  appliedAt: string;
  approvedAt?: string;
  remarks?: string;
}

export interface LoanApplicationRequest {
  id: string;
  requestNumber: string;
  accountId: string;
  borrowerName: string;
  accountNumber: string;
  loanProductId: string;
  loanProductName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bankId: string;
  bankName: string;
  requestedBy: string;
  reviewedBy?: string;
  requestedAt: string;
  reviewedAt?: string;
  remarks?: string;
}

export interface LoanDisbursement {
  id: string;
  disbursementNumber: string;
  loanApplicationId: string;
  accountId: string;
  borrowerName: string;
  accountNumber: string;
  amount: number;
  disbursedTo: string;
  disbursedBy: string;
  bankId: string;
  bankName: string;
  disbursedAt: string;
  repaymentSchedule: RepaymentSchedule[];
}

export interface RepaymentSchedule {
  id: string;
  installmentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
}

export interface LoanAdjustment {
  id: string;
  adjustmentNumber: string;
  loanApplicationId: string;
  accountId: string;
  borrowerName: string;
  adjustmentType: 'penalty_waiver' | 'overpayment' | 'partial_settlement' | 'interest_recalculation' | 'early_closure';
  amount: number;
  reason: string;
  approvedBy: string;
  bankId: string;
  bankName: string;
  adjustedAt: string;
}

export interface LoanTransfer {
  id: string;
  transferNumber: string;
  loanApplicationId: string;
  fromBankId: string;
  fromBankName: string;
  toBankId: string;
  toBankName: string;
  outstandingAmount: number;
  penalties: number;
  closingCharges: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  approvedBy?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface Regulator {
  id: string;
  name: string;
  email: string;
  password: string;
  organization: string;
  isActive: boolean;
  createdAt: string;
}


