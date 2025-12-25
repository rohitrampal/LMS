import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, Bank, BankEmployee, Account, LoanCategory, LoanProduct,
  LoanApplication, LoanApplicationRequest, LoanDisbursement,
  LoanAdjustment, LoanTransfer, Regulator
} from '@/types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  
  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserByEmail: (email: string) => User | undefined;
  
  // Banks
  banks: Bank[];
  addBank: (bank: Bank) => void;
  updateBank: (id: string, bank: Partial<Bank>) => void;
  deleteBank: (id: string) => void;
  getBankById: (id: string) => Bank | undefined;
  
  // Bank Employees
  bankEmployees: BankEmployee[];
  addBankEmployee: (employee: BankEmployee) => void;
  updateBankEmployee: (id: string, employee: Partial<BankEmployee>) => void;
  deleteBankEmployee: (id: string) => void;
  
  // Accounts
  accounts: Account[];
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  // Loan Categories
  loanCategories: LoanCategory[];
  addLoanCategory: (category: LoanCategory) => void;
  updateLoanCategory: (id: string, category: Partial<LoanCategory>) => void;
  deleteLoanCategory: (id: string) => void;
  
  // Loan Products
  loanProducts: LoanProduct[];
  addLoanProduct: (product: LoanProduct) => void;
  updateLoanProduct: (id: string, product: Partial<LoanProduct>) => void;
  deleteLoanProduct: (id: string) => void;
  
  // Loan Applications
  loanApplications: LoanApplication[];
  addLoanApplication: (application: LoanApplication) => void;
  updateLoanApplication: (id: string, application: Partial<LoanApplication>) => void;
  deleteLoanApplication: (id: string) => void;
  
  // Loan Application Requests
  loanApplicationRequests: LoanApplicationRequest[];
  addLoanApplicationRequest: (request: LoanApplicationRequest) => void;
  updateLoanApplicationRequest: (id: string, request: Partial<LoanApplicationRequest>) => void;
  deleteLoanApplicationRequest: (id: string) => void;
  
  // Loan Disbursements
  loanDisbursements: LoanDisbursement[];
  addLoanDisbursement: (disbursement: LoanDisbursement) => void;
  updateLoanDisbursement: (id: string, disbursement: Partial<LoanDisbursement>) => void;
  
  // Loan Adjustments
  loanAdjustments: LoanAdjustment[];
  addLoanAdjustment: (adjustment: LoanAdjustment) => void;
  updateLoanAdjustment: (id: string, adjustment: Partial<LoanAdjustment>) => void;
  
  // Loan Transfers
  loanTransfers: LoanTransfer[];
  addLoanTransfer: (transfer: LoanTransfer) => void;
  updateLoanTransfer: (id: string, transfer: Partial<LoanTransfer>) => void;
  
  // Regulators
  regulators: Regulator[];
  addRegulator: (regulator: Regulator) => void;
  updateRegulator: (id: string, regulator: Partial<Regulator>) => void;
  deleteRegulator: (id: string) => void;
  
  // Initialize dummy data
  initializeDummyData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      
      login: (email: string, password: string) => {
        const users = get().users;
        const user = users.find(u => u.email === email && u.password === password && u.isActive);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: !!user });
      },
      
      // Users
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),
      getUserByEmail: (email) => get().users.find(u => u.email === email),
      
      // Banks
      banks: [],
      addBank: (bank) => set((state) => ({ banks: [...state.banks, bank] })),
      updateBank: (id, updates) => set((state) => ({
        banks: state.banks.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBank: (id) => set((state) => ({
        banks: state.banks.filter(b => b.id !== id)
      })),
      getBankById: (id) => get().banks.find(b => b.id === id),
      
      // Bank Employees
      bankEmployees: [],
      addBankEmployee: (employee) => set((state) => ({
        bankEmployees: [...state.bankEmployees, employee]
      })),
      updateBankEmployee: (id, updates) => set((state) => ({
        bankEmployees: state.bankEmployees.map(e => 
          e.id === id ? { ...e, ...updates } : e
        )
      })),
      deleteBankEmployee: (id) => set((state) => ({
        bankEmployees: state.bankEmployees.filter(e => e.id !== id)
      })),
      
      // Accounts
      accounts: [],
      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id)
      })),
      
      // Loan Categories
      loanCategories: [],
      addLoanCategory: (category) => set((state) => ({
        loanCategories: [...state.loanCategories, category]
      })),
      updateLoanCategory: (id, updates) => set((state) => ({
        loanCategories: state.loanCategories.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      deleteLoanCategory: (id) => set((state) => ({
        loanCategories: state.loanCategories.filter(c => c.id !== id)
      })),
      
      // Loan Products
      loanProducts: [],
      addLoanProduct: (product) => set((state) => ({
        loanProducts: [...state.loanProducts, product]
      })),
      updateLoanProduct: (id, updates) => set((state) => ({
        loanProducts: state.loanProducts.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      deleteLoanProduct: (id) => set((state) => ({
        loanProducts: state.loanProducts.filter(p => p.id !== id)
      })),
      
      // Loan Applications
      loanApplications: [],
      addLoanApplication: (application) => set((state) => ({
        loanApplications: [...state.loanApplications, application]
      })),
      updateLoanApplication: (id, updates) => set((state) => ({
        loanApplications: state.loanApplications.map(a => 
          a.id === id ? { ...a, ...updates } : a
        )
      })),
      deleteLoanApplication: (id) => set((state) => ({
        loanApplications: state.loanApplications.filter(a => a.id !== id)
      })),
      
      // Loan Application Requests
      loanApplicationRequests: [],
      addLoanApplicationRequest: (request) => set((state) => ({
        loanApplicationRequests: [...state.loanApplicationRequests, request]
      })),
      updateLoanApplicationRequest: (id, updates) => set((state) => ({
        loanApplicationRequests: state.loanApplicationRequests.map(r => 
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteLoanApplicationRequest: (id) => set((state) => ({
        loanApplicationRequests: state.loanApplicationRequests.filter(r => r.id !== id)
      })),
      
      // Loan Disbursements
      loanDisbursements: [],
      addLoanDisbursement: (disbursement) => set((state) => ({
        loanDisbursements: [...state.loanDisbursements, disbursement]
      })),
      updateLoanDisbursement: (id, updates) => set((state) => ({
        loanDisbursements: state.loanDisbursements.map(d => 
          d.id === id ? { ...d, ...updates } : d
        )
      })),
      
      // Loan Adjustments
      loanAdjustments: [],
      addLoanAdjustment: (adjustment) => set((state) => ({
        loanAdjustments: [...state.loanAdjustments, adjustment]
      })),
      updateLoanAdjustment: (id, updates) => set((state) => ({
        loanAdjustments: state.loanAdjustments.map(a => 
          a.id === id ? { ...a, ...updates } : a
        )
      })),
      
      // Loan Transfers
      loanTransfers: [],
      addLoanTransfer: (transfer) => set((state) => ({
        loanTransfers: [...state.loanTransfers, transfer]
      })),
      updateLoanTransfer: (id, updates) => set((state) => ({
        loanTransfers: state.loanTransfers.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      // Regulators
      regulators: [],
      addRegulator: (regulator) => set((state) => ({
        regulators: [...state.regulators, regulator]
      })),
      updateRegulator: (id, updates) => set((state) => ({
        regulators: state.regulators.map(r => 
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteRegulator: (id) => set((state) => ({
        regulators: state.regulators.filter(r => r.id !== id)
      })),
      
      // Initialize dummy data
      initializeDummyData: () => {
        const now = new Date().toISOString();
        
        // Initialize only if data doesn't exist
        if (get().users.length > 0) return;
        
        // Create dummy banks
        const bank1: Bank = {
          id: 'bank-1',
          name: 'First National Bank',
          email: 'bank1@yopmail.com',
          address: '123 Main St, City',
          phone: '+1234567890',
          registrationNumber: 'BANK001',
          isActive: true,
          createdAt: now,
        };
        
        const bank2: Bank = {
          id: 'bank-2',
          name: 'United Commercial Bank',
          email: 'bank2@yopmail.com',
          address: '456 Oak Ave, City',
          phone: '+1234567891',
          registrationNumber: 'BANK002',
          isActive: true,
          createdAt: now,
        };
        
        // Create dummy users
        const superAdmin: User = {
          id: 'user-superadmin',
          email: 'superadmin@yopmail.com',
          password: 'admin123',
          name: 'Super Admin',
          role: 'superadmin',
          isActive: true,
          createdAt: now,
        };
        
        const admin: User = {
          id: 'user-admin',
          email: 'admin@yopmail.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          createdAt: now,
        };
        
        const bankAdmin: User = {
          id: 'user-bank1',
          email: 'bankadmin@yopmail.com',
          password: 'admin123',
          name: 'Bank Admin',
          role: 'bank',
          bankId: bank1.id,
          bankName: bank1.name,
          isActive: true,
          createdAt: now,
        };
        
        const regulator: User = {
          id: 'user-regulator',
          email: 'regulator@yopmail.com',
          password: 'admin123',
          name: 'Regulator',
          role: 'regulator',
          isActive: true,
          createdAt: now,
        };
        
        const bankEmployee: BankEmployee = {
          id: 'emp-1',
          name: 'John Manager',
          email: 'bankemployee@yopmail.com',
          password: 'admin123',
          bankId: bank1.id,
          bankName: bank1.name,
          role: 'manager',
          permissions: ['loan_applications', 'loan_disbursements', 'accounts'],
          isActive: true,
          createdAt: now,
        };
        
        // Add all dummy data
        set({
          banks: [bank1, bank2],
          users: [superAdmin, admin, bankAdmin, regulator],
          bankEmployees: [bankEmployee],
        });
      },
    }),
    {
      name: 'lms-storage',
    }
  )
);

