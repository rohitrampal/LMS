import type { UserRole } from '@/types';

export const getModulesByRole = (role: UserRole): string[] => {
  switch (role) {
    case 'superadmin':
      return ['Dashboard', 'Admins', 'Regulators', 'Banks', 'Analytics'];
    case 'admin':
      return ['Dashboard', 'Regulators', 'Banks', 'Analytics'];
    case 'bank':
      return [
        'Dashboard',
        'Bank Employees',
        'Accounts',
        'Loan Categories',
        'Loan Products',
        'Loan Applications',
        'Loan Application Requests',
        'Loan Disbursements',
        'Loan Adjustments',
        'Reports'
      ];
    case 'bank_employee':
      return [
        'Accounts',
        'Loan Categories',
        'Loan Products',
        'Loan Applications',
        'Loan Application Requests',
        'Loan Disbursements',
        'Loan Adjustments',
        'Reports'
      ];
    case 'regulator':
      return [
        'Banks',
        'Accounts',
        'Loan Categories',
        'Loan Applications',
        'Loan Application Requests',
        'Loan Disbursements',
        'Loan Adjustments',
        'Reports'
      ];
    default:
      return [];
  }
};

export const hasPermission = (
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission) || userPermissions.includes('all');
};

export const canAccessModule = (role: UserRole, module: string): boolean => {
  const modules = getModulesByRole(role);
  return modules.includes(module);
};


